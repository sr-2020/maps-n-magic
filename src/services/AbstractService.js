export class AbstractService {
  metadata = {
    actions: [],
    requests: [],
    emitEvents: [],
    listenEvents: [],
  };

  init(gameModel) {
    this.gameModel = gameModel;
  }

  setData(database) {}

  getData() {
    return {};
  }

  dispose() {}

  execute(action, onDefaultAction) {
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    return onDefaultRequest(request);
  }

  emit(...args) {
    return this.gameModel.emit(...args);
  }

  on(...args) {
    return this.gameModel.on(...args);
  }

  off(...args) {
    return this.gameModel.off(...args);
  }

  getFromModel(...args) {
    return this.gameModel.get(...args);
  }

  executeOnModel(...args) {
    return this.gameModel.execute(...args);
  }
}
