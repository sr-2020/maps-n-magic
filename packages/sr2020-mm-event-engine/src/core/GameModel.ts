// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { EventEmitter } from 'events';

import { GameModelVerificator } from './GameModelVerificator';
import { AbstractService } from './AbstractService';
import { AbstractEventProcessor } from "./AbstractEventProcessor";

import { GMAction, GMRequest, GMLogger, GMTyped, GMEvent, Req, Res, TypeOnly } from "./types";
import { stringToType, getChildLogger } from "./utils";

export interface ServiceIndex {
  [index: string]: AbstractService;
}

export class GameModelImpl extends EventEmitter {
  actionMap: ServiceIndex;

  requestMap: ServiceIndex;

  verificator: GameModelVerificator;

  services: AbstractService[];

  // mostly data bindings are here
  eventProcessors: AbstractEventProcessor[];

  // migrator: unknown;

  constructor(private logger: GMLogger) {
    super();
    this.actionMap = {};
    this.requestMap = {};
    this.verificator = new GameModelVerificator();
    this.services = [];
    this.eventProcessors = [];
  }

  // init(serviceClasses: typeof AbstractService[]) {
  //   // this.services = services;
  //   serviceClasses.forEach((serviceClass) => {
      
  //     // this.logger.info('Creating service', service.constructor.name);
  //     this.logger.info('Creating service', serviceClass.name);
  //     const childLogger = getChildLogger(this.logger, { service: serviceClass.name });
  //     const service = new serviceClass(this, childLogger);
  //     // const service: AbstractService = new ServiceClass(childLogger);
  //     // service.init(this, childLogger);
  //     service.init();
  //     this.registerService(service);
  //     return service;
  //   });

  //   this.verificator.verifyServices(this.services);

  //   this.verificator.finishVerification();

  //   // this.migrator = migrator;
  // }

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
    this.services.push(service);
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

  registerEventProcessor(eventProcessor: AbstractEventProcessor) {
    this.eventProcessors.push(eventProcessor);
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

  execute2<
    ActionHandler extends (type: any) => StateType, 
    StateType = Res<ActionHandler>
  >(rawAction: Req<ActionHandler>): StateType {
    const action = stringToType<GMAction>((rawAction as unknown) as GMTyped);
    const service = this.actionMap[action.type];
    if (service) {
      return service.execute(action);
    }
    throw new Error(`Unknown action ${JSON.stringify(action)}`);
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    // this.logger.info(`Subscribe on GM event ${String(event)}`);
    return super.on(event, listener);
  }

  on2<Event extends GMEvent>(event: Event["type"], listener: (event: Event) => void): this {
    // this.logger.info(`Subscribe on GM event ${String(event)}`);
    return super.on(event, listener);
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    // this.logger.info(`listenerCount for ${event.toString()} is ${super.listenerCount(event)}`);
    return super.emit(event, ...args);
  }

  emit2<Event extends GMEvent>(event: Event): boolean {
    return this.emit(event.type, event);
  }

  get<T>(rawRequest: GMRequest | string): T {
    const request = stringToType<GMRequest>(rawRequest);
    const service = this.requestMap[request.type];
    if (service !== undefined) {
      return service.get(request);
    }
    throw new Error(`Unknown request ${JSON.stringify(request)}`);
  }

  get2<
    RequestHandler extends (type: any) => StateType, 
    StateType = Res<RequestHandler>
  >(rawRequest: Req<RequestHandler>): StateType {
    const request = stringToType<GMRequest>(rawRequest);
    const service = this.requestMap[request.type];
    if (service !== undefined) {
      return service.get(request);
    }
    throw new Error(`Unknown request ${JSON.stringify(request)}`);
  }

  dispose(): void {
    this.services.forEach((service) => service.dispose());
    this.eventProcessors.forEach((ep) => ep.dispose());
  }

  verifyEvents(){
    this.verificator.verifyEvents(this.services, this.eventProcessors);
  }

  finishVerification() {
    this.verificator.finishVerification();
  }
}


export type GameModel = Pick<
  GameModelImpl, 
  // requests
  "get"        | 
  "get2"       | 
  "hasRequest" |
  // actions
  "execute"    |
  "execute2"   |
  // events
  "on"         | 
  "on2"        | 
  "off"        |
  "emit"       | 
  "emit2"      |
  "listenerCount"
>;