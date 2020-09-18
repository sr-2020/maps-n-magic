import * as R from 'ramda';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function typeToGetter(type) {
  return `get${capitalizeFirstLetter(type)}`;
}

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
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

  // eslint-disable-next-line class-methods-use-this
  setData(database) {}

  // eslint-disable-next-line class-methods-use-this
  getData() {
    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}

  execute(action, onDefaultAction) {
    const includes = this.metadata.actions.includes(action.type);
    if (includes && !!this[action.type]) {
      return this[action.type](action);
    }
    if (!includes) {
      throw new Error(`Action ${action.type} is not found in ${this.constructor.name} metadata`);
    } else {
      throw new Error(`Action ${action.type} is not found in ${this.constructor.name} instance`);
    }

    // return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    const includes = this.metadata.requests.includes(request.type);
    if (includes && !!this[typeToGetter(request.type)]) {
      return this[typeToGetter(request.type)](request);
    }
    if (!includes) {
      throw new Error(`Request ${request.type} is not found in ${this.constructor.name} metadata`);
    } else {
      throw new Error(`Request ${request.type} is not found in ${this.constructor.name} instance`);
    }

    // return onDefaultRequest(request);
  }

  emit(...args) {
    if (!this.metadata.emitEvents.includes(args[0])) {
      throw new Error(`Event ${args[0]} is not in emit events list of ${this.constructor.name}`);
    }
    return this.gameModel.emit(...args);
  }

  on(...args) {
    if (!this.metadata.listenEvents.includes(args[0])) {
      throw new Error(`Event ${args[0]} is not in listen events list of ${this.constructor.name}`);
    }
    return this.gameModel.on(...args);
  }

  off(...args) {
    if (!this.metadata.listenEvents.includes(args[0])) {
      throw new Error(`Event ${args[0]} is not in listen events list of ${this.constructor.name}`);
    }
    return this.gameModel.off(...args);
  }

  getFromModel(...args) {
    const request = stringToType(args[0]);

    const { needRequests } = this.metadata;
    if (needRequests && !needRequests.includes(request.type)) {
      throw new Error(`Request ${request.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.get(...args);
  }

  executeOnModel(...args) {
    const action = stringToType(args[0]);

    const { needActions } = this.metadata;
    if (needActions && !needActions.includes(action.type)) {
      throw new Error(`Action ${action.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.execute(...args);
  }
}
