class WebSocketWrapper {
  constructor(ws, gameModel, initConfig) {
    this.ws = ws;
    this.gameModel = gameModel;
    this.initConfig = initConfig;
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.forwardAction = this.forwardAction.bind(this);
    this.subscribeWsConnection('on');
    this.subscribe('on');
    this.innerInit();
  }

  innerInit() {
    const { data } = this.initConfig;
    this.ws.send(JSON.stringify({
      type: data.type,
      [data.payload]: this.gameModel.get(data.payload),
    }));
  }

  onMessage(msgStr) {
    console.log('msgStr', msgStr);
    this.gameModel.execute(JSON.parse(msgStr));
  }

  onClose() {
    this.dispose();
  }

  onError() {
    this.dispose();
  }

  forwardAction(action) {
    this.ws.send(JSON.stringify(action));
  }

  subscribe(action) {
    const { forwardActions } = this.initConfig;
    forwardActions.forEach((actionType) => this.gameModel[action](actionType, this.forwardAction));
  }

  subscribeWsConnection(action) {
    this.ws[action]('message', this.onMessage);
    this.ws[action]('close', this.onClose);
    this.ws[action]('error', this.onError);
  }

  dispose() {
    this.subscribeWsConnection('off');
    this.subscribe('off');
  }
}

exports.WebSocketWrapper = WebSocketWrapper;
