// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { GameModelVerificator } from './GameModelVerificator';
import { AbstractService } from './AbstractService';

import { GMAction, GMRequest, GMLogger, GMTyped } from "./types";
import { stringToType, getChildLogger } from "./utils";

export interface ServiceIndex {
  [index: string]: AbstractService;
}

export class GameModel extends EventEmitter {
  actionMap: ServiceIndex;

  requestMap: ServiceIndex;

  verificator: GameModelVerificator;

  services: AbstractService[];

  // migrator: unknown;

  constructor(private logger: GMLogger) {
    super();
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
      const childLogger = getChildLogger(this.logger, { service: serviceClass.name });
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

  // What I want - I want to explicitly require generic type to validate action.
  // It is not enough to set it to never + it doesn't work with extends.
  execute2<ActionType extends GMTyped | string, T = unknown>(rawAction: ActionType): T {
    const action = stringToType<GMAction>((rawAction as unknown) as GMTyped);
    const service = this.actionMap[action.type];
    if (service) {
      return service.execute<T>(action);
    }
    throw new Error(`Unknown action ${JSON.stringify(action)}`);
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.logger.info(`Subscribe on GM event ${String(event)}`);
    return super.on(event, listener);
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
