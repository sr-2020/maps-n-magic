// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { GameModelVerificator } from './GameModelVerificator';
import { AbstractService } from './AbstractService';

import { GMAction, GMRequest, GMLogger } from "./types";
import { stringToType } from "./utils";

export interface ServiceIndex {
  [index: string]: AbstractService;
}

export class GameModel extends EventEmitter {
  logger: GMLogger;

  actionMap: ServiceIndex;

  requestMap: ServiceIndex;

  verificator: GameModelVerificator;

  services: AbstractService[];

  // migrator: any;

  constructor(logger: GMLogger) {
    super();
    this.logger = logger;
    this.actionMap = {};
    this.requestMap = {};
    this.verificator = new GameModelVerificator();
    this.services = [];
  }

  init(serviceClasses: typeof AbstractService[]) {
    // this.services = services;
    serviceClasses.forEach((serviceClass) => {
      
      // this.logger.info('Creating service', service.constructor.name);
      this.logger.info('Creating service', serviceClass.name);
      let childLogger = this.logger;
      if (this.logger.customChild) {
        // childLogger = this.logger.customChild(this.logger, { service: service.constructor.name });
        childLogger = this.logger.customChild(this.logger, { service: serviceClass.name });
      }
      const service = new serviceClass(this, childLogger);
      // const service: AbstractService = new ServiceClass(childLogger);
      // service.init(this, childLogger);
      service.init();
      this.registerService(service);
      return service;
    });

    this.verificator.verifyServices(this.services);

    this.verificator.finishVerification();

    // this.migrator = migrator;
  }

  // setData(database) {
  //   if (this.migrator) {
  //     database = this.migrator.migrate(database);
  //   }
  //   this.services.forEach((service) => service.setData(database));
  // }

  // getData() {
  //   return R.mergeAll(this.services.map((service) => service.getData()));
  // }

  registerService(service: AbstractService): void {
    const { actions = [], requests = [] } = service.metadata;
    const localActionMap: ServiceIndex = R.fromPairs(actions.map((action) => [action, service]));
    this.verificator.checkActionOverrides(service, actions, this.actionMap);
    this.actionMap = {
      ...this.actionMap,
      ...localActionMap,
    };

    const localRequestsMap: ServiceIndex = R.fromPairs(requests.map((request) => [request, service]));
    this.verificator.checkRequestOverrides(service, requests, this.requestMap);
    this.requestMap = {
      ...this.requestMap,
      ...localRequestsMap,
    };
  }

  hasRequest(request: string): boolean {
    return !!this.requestMap[request];
  }

  execute<T>(rawAction: GMAction | string): T {
    const action = stringToType<GMAction>(rawAction);
    const service = this.actionMap[action.type];
    if (service) {
      return service.execute<T>(action);
    }
    throw new Error(`Unknown action ${JSON.stringify(action)}`);
  }

  get<T>(rawRequest: GMRequest | string): T {
    const request = stringToType<GMRequest>(rawRequest);
    const service = this.requestMap[request.type];
    if (service !== undefined) {
      return service.get(request);
    }
    throw new Error(`Unknown request ${JSON.stringify(request)}`);
  }

  dispose(): void {
    this.services.forEach((service) => service.dispose());
  }
}
