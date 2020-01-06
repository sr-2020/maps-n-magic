// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import EventEmitter from 'events';

import { UserService } from './UserService';

import { BotService } from './BotService';

import { TickerService } from './TickerService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class GameModel extends EventEmitter {
  constructor() {
    super();
    this.actionMap = {};
    this.requestMap = {};
    this.initErrors = [];
    this.onDefaultAction = this.onDefaultAction.bind(this);
    this.onDefaultRequest = this.onDefaultRequest.bind(this);
  }

  init() {
    const services = [UserService, BotService, TickerService];
    this.services = services.map((ServiceClass) => {
      const service = new ServiceClass();
      service.init(this);
      this.registerService(service);
      return service;
    });

    this.verifyServices();

    if (!R.isEmpty(this.initErrors)) {
      this.initErrors.forEach((err) => console.error(err));
      throw new Error(`Found ${this.initErrors.length} errors during game model initialization\n${this.initErrors.join('\n')}`);
    }
  }

  registerService(service) {
    const { actions = [], requests = [] } = service.metadata;
    const localActionMap = R.fromPairs(actions.map((action) => [action, service]));

    const actionIntersection = R.intersection(R.keys(this.actionMap), actions);
    if (!R.isEmpty(actionIntersection)) {
      actionIntersection.forEach((action) => {
        const service1 = service.constructor.name;
        const service2 = this.actionMap[action].constructor.name;
        this.initErrors.push(`Action with name ${action} is processed by two services: ${service1} and ${service2}`);
      });
    }

    this.actionMap = {
      ...this.actionMap,
      ...localActionMap,
    };

    const localRequestsMap = R.fromPairs(requests.map((request) => [request, service]));

    const requestIntersection = R.intersection(R.keys(this.requestMap), requests);
    if (!R.isEmpty(requestIntersection)) {
      requestIntersection.forEach((request) => {
        const service1 = service.constructor.name;
        const service2 = this.requestMap[request].constructor.name;
        this.initErrors.push(`Request with name ${request} is processed by two services: ${service1} and ${service2}`);
      });
    }

    this.requestMap = {
      ...this.requestMap,
      ...localRequestsMap,
    };
  }

  verifyServices() {
    const allEmittedEvents = R.flatten(this.services.map((service) => service.metadata.emitEvents || []));
    this.services.forEach((service) => {
      const { listenEvents = [] } = service.metadata;
      const diff = R.difference(listenEvents, allEmittedEvents);
      if (!R.isEmpty(diff)) {
        diff.forEach((eventname) => {
          const serviceName = service.constructor.name;
          this.initErrors.push(`No event emitter for ${eventname} which is expected by ${serviceName}`);
        });
      }
    });
  }

  dispatch(action) {
    action = stringToType(action);
    const service = this.actionMap[action.type];
    if (service) {
      service.dispatch(action, this.onDefaultAction);
      return;
    }

    this.onDefaultAction(action);
  }

  // eslint-disable-next-line class-methods-use-this
  onDefaultAction(action) {
    throw new Error(`Unknown action ${JSON.stringify(action)}`);
  }

  get(request) {
    request = stringToType(request);
    const service = this.requestMap[request.type];
    if (service) {
      return service.get(request, this.onDefaultRequest);
    }
    return this.onDefaultRequest(request);
  }

  // eslint-disable-next-line class-methods-use-this
  onDefaultRequest(request) {
    throw new Error(`Unknown request ${JSON.stringify(request)}`);
  }

  dispose() {
    this.services.forEach((service) => service.dispose());
  }
}
