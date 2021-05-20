import * as R from 'ramda';
import WebSocket from "ws";
import { GameModel, GMLogger, WebSocketInitClientConfig, EPostNotification } from "sr2020-mm-event-engine";

export class WebSocketWrapper {
  constructor(
    private ws: WebSocket, 
    private gameModel: GameModel, 
    private initConfig: WebSocketInitClientConfig, 
    private logger: GMLogger
  ) {
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.forwardAction = this.forwardAction.bind(this);
    this.subscribeWsConnection('on');
    this.subscribe('on');
    this.innerInit();
    // console.log('forward actions', initConfig.forwardActions);
  }

  innerInit() {
    const { data } = this.initConfig;
    data.forEach((item) => {
      if (!this.gameModel.hasRequest(item.payload)) {
        this.logger.error('GameModel unsupported request:', item.payload);
        this.gameModel.emit2<EPostNotification>({
          type: 'postNotification',
          title: `GameModel unsupported request`,
          message: `Request type: ${item.payload}`,
          kind: 'error',
        });
        return;
      }
      // this.logger.info('sendingData', item.type, item.payload, this.gameModel.get(item.payload));
      this.ws.send(JSON.stringify({
        type: item.type,
        [item.payload]: this.gameModel.get(item.payload),
      }));
    });
  }

  onMessage(msgStr: WebSocket.Data) {
    try {
      const msg = JSON.parse(msgStr.toString());
      if (R.is(String, msg)) {
        this.logger.info(msg);
        this.gameModel.emit(msg);
      } else {
        this.logger.info(msg.type, msgStr);
        this.gameModel.emit(msg.type, msg);
      }
    } catch(err) {
      this.logger.error('Error on processing message:', msgStr, ', error', err);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title: `Error on processing message`,
        message: `Err: ${err.message || err}, message ${msgStr}`,
        kind: 'error',
      });
    }
  }

  onClose() {
    this.dispose();
  }

  onError() {
    this.dispose();
  }

  forwardAction(action: unknown) {
    // console.log('forwardAction', action.type);
    this.ws.send(JSON.stringify(action));
  }

  subscribe(action: 'on' | 'off') {
    const { forwardActions } = this.initConfig;
    forwardActions.forEach((actionType) => this.gameModel[action](actionType, this.forwardAction));
  }

  subscribeWsConnection(action: 'on' | 'off') {
    this.ws[action]('message', this.onMessage);
    this.ws[action]('close', this.onClose);
    this.ws[action]('error', this.onError);
  }

  dispose() {
    this.subscribeWsConnection('off');
    this.subscribe('off');
  }
}

// exports.WebSocketWrapper = WebSocketWrapper;