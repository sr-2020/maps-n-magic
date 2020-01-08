export class AbstractService {
  metadata = {
    actions: [],
    requests: [],
    emitEvents: [],
    listenEvents: [],
  };

  init(gameModel) {}

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
}
