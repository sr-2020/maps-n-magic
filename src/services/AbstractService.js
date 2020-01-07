export class AbstractService {
  metadata = {
    actions: [],
    requests: [],
    emitEvents: [],
    listenEvents: [],
  };

  init(gameModel) {}

  setData(database) {}

  getData() {}

  dispose() {}

  execute(action, onDefaultAction) {
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    return onDefaultRequest(request);
  }
}
