// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { GameModelVerificator } from './GameModelVerificator';
import { AbstractService } from './AbstractService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export interface ServiceIndex {
  [index: string]: AbstractService;
}

export class GameModel extends EventEmitter {
  logger: any;

  actionMap: ServiceIndex;

  requestMap: ServiceIndex;

  verificator: GameModelVerificator;

  services: AbstractService[];

  migrator: any;

  constructor(logger) {
    super();
    this.logger = logger;
    this.actionMap = {};
    this.requestMap = {};
    this.verificator = new GameModelVerificator();
    this.onDefaultAction = this.onDefaultAction.bind(this);
    this.onDefaultRequest = this.onDefaultRequest.bind(this);
  }

  init(services, migrator) {
    this.services = services.map((ServiceClass) => {
      this.logger.info('Creating service', ServiceClass.name);
      let childLogger = this.logger;
      if (this.logger.customChild) {
        childLogger = this.logger.customChild(this.logger, { service: ServiceClass.name });
      }
      const service: AbstractService = new ServiceClass(childLogger);
      service.init(this);
      this.registerService(service);
      return service;
    });

    this.verificator.verifyServices(this.services);

    this.verificator.finishVerification();

    this.migrator = migrator;
  }

  setData(database) {
    if (this.migrator) {
      database = this.migrator.migrate(database);
    }
    this.services.forEach((service) => service.setData(database));
  }

  getData() {
    return R.mergeAll(this.services.map((service) => service.getData()));
  }

  registerService(service: AbstractService): void {
    const { actions = [], requests = [] } = service.metadata;
    const localActionMap = R.fromPairs(actions.map((action) => [action, service]));
    this.verificator.checkActionOverrides(service, actions, this.actionMap);
    this.actionMap = {
      ...this.actionMap,
      ...localActionMap,
    };

    const localRequestsMap = R.fromPairs(requests.map((request) => [request, service]));
    this.verificator.checkRequestOverrides(service, requests, this.requestMap);
    this.requestMap = {
      ...this.requestMap,
      ...localRequestsMap,
    };
  }

  hasRequest(request: string): boolean {
    return !!this.requestMap[request];
  }

  execute(action) {
    action = stringToType(action);
    const service = this.actionMap[action.type];
    if (service) {
      return service.execute(action, this.onDefaultAction);
    }

    return this.onDefaultAction(action);
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
