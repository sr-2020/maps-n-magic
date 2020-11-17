class WebSocketWrapper {
  constructor(ws, gameModel, initConfig, logger) {
    this.ws = ws;
    this.gameModel = gameModel;
    this.initConfig = initConfig;
    this.logger = logger;
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
        this.logger.info('GameModel unsupported request:', item.payload);
        return;
      }
      this.ws.send(JSON.stringify({
        type: item.type,
        [item.payload]: this.gameModel.get(item.payload),
      }));
    });
  }

  onMessage(msgStr) {
    // console.log('recieved action', msgStr);
    this.gameModel.execute(JSON.parse(msgStr));
  }

  onClose() {
    this.dispose();
  }

  onError() {
    this.dispose();
  }

  forwardAction(action) {
    // console.log('forwardAction', action.type);
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
