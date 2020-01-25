function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function typeToGetter(type) {
  return `get${capitalizeFirstLetter(type)}`;
}

export class AbstractService {
  metadata = {
    actions: [],
    requests: [],
    emitEvents: [],
    needActions: [],
    needRequests: [],
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
    const includes = this.metadata.actions.includes(action.type);
    if (includes) {
      return this[action.type](action);
    }
    console.error(`Action ${action.type} is not found in ${this.constructor.name}`);

    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    const includes = this.metadata.requests.includes(request.type);
    if (includes) {
      return this[typeToGetter(request.type)](request);
    }
    console.error(`Request ${request.type} is not found in ${this.constructor.name}`);

    return onDefaultRequest(request);
  }

  emit(...args) {
    if (!this.metadata.emitEvents.includes(args[0])) {
      throw new Error(`Event ${args[0]} is not in emit events list of ${this.constructor.name}`);
    }
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
