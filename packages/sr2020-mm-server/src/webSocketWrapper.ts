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
    // this.logger.info('constructor');
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.forwardAction = this.forwardAction.bind(this);
    this.subscribeWsConnection('on');
    this.subscribe('on');
    this.innerInit();
    // this.logger.info('forward actions', initConfig.forwardActions);
  }

  innerInit() {
    // this.logger.info('innerInit');
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
    // this.logger.info('onMessage');
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
      this.logger.error(`Error on processing message: ${msgStr}, error ${err}`);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title: `Error on processing message`,
        message: `Err: ${err.message || err}, message ${msgStr}`,
        kind: 'error',
      });
    }
  }

  onClose() {
    // this.logger.info('onClose');
    this.dispose();
  }

  onError() {
    // this.logger.info('onError');
    this.dispose();
  }

  forwardAction(action: unknown) {
    // this.logger.info('forwardAction', action.type);
    try {
      this.ws.send(JSON.stringify(action));
    } catch(err) {
      this.logger.error('Error on sending message in websocket:', err);
    }
  }

  subscribe(action: 'on' | 'off') {
    // this.logger.info(`subscribe ${action}`);
    const { forwardActions } = this.initConfig;
    forwardActions.forEach((actionType) => this.gameModel[action](actionType, this.forwardAction));
  }

  subscribeWsConnection(action: 'on' | 'off') {
    // this.logger.info(`subscribeWsConnection ${action}`);
    this.ws[action]('message', this.onMessage);
    this.ws[action]('close', this.onClose);
    this.ws[action]('error', this.onError);
  }

  dispose() {
    // this.logger.info('dispose');
    this.subscribeWsConnection('off');
    this.subscribe('off');
  }
}

// exports.WebSocketWrapper = WebSocketWrapper;
