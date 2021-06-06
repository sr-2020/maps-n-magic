import * as R from 'ramda';

import { GameModel } from "./GameModel";

import { 
  Metadata, 
  GMAction, 
  GMRequest, 
  GMLogger,
  GMEvent,
  DefaultGMEvent,
  Req,
  Res,
  RequestHandler,
  ServiceContract,
  ServiceContractTypes,
  DefaultServiceContract
} from "./types";
import { stringToType, typeToGetter } from "./utils";

export class AbstractService<
  F extends ServiceContract = DefaultServiceContract,
> {
  metadata: ServiceContractTypes<F> = {
    actions: [],
    requests: [],
    emitEvents: [],
    needActions: [],
    needRequests: [],
    listenEvents: [],
  };

  constructor(public gameModel: GameModel, public logger: GMLogger) {}

  init() {}

  // eslint-disable-next-line class-methods-use-this
  dispose() {}

  // used only internally in GameModel
  execute<T>(action: GMAction): T {
    const includes = this.metadata.actions.includes(action.type);
    // @ts-ignore
    if (includes && !!this[action.type]) {
      // @ts-ignore
      return this[action.type](action);
    }
    if (!includes) {
      throw new Error(`Action ${action.type} is not found in ${this.constructor.name} metadata`);
    } else {
      throw new Error(`Action ${action.type} is not found in ${this.constructor.name} instance`);
    }

    // return onDefaultAction(action);
  }

  // used only internally in GameModel
  get<T>(request: GMRequest): T {
    const includes = this.metadata.requests.includes(request.type);
    // @ts-ignore
    if (includes && !!this[typeToGetter(request.type)]) {
      // @ts-ignore
      return this[typeToGetter(request.type)](request);
    }
    if (!includes) {
      throw new Error(`Request ${request.type} is not found in ${this.constructor.name} metadata`);
    } else {
      throw new Error(`Request ${request.type} is not found in ${this.constructor.name} instance`);
    }

    // return onDefaultRequest(request);
  }

  // get2<T extends F["Request"]>(request: Req<T>): Res<T> {
  //   const includes = this.metadata.requests.includes(request.type);
  //   // @ts-ignore
  //   if (includes && !!this[typeToGetter(request.type)]) {
  //     // @ts-ignore
  //     return this[typeToGetter(request.type)](request);
  //   }
  //   if (!includes) {
  //     throw new Error(`Request ${request.type} is not found in ${this.constructor.name} metadata`);
  //   } else {
  //     throw new Error(`Request ${request.type} is not found in ${this.constructor.name} instance`);
  //   }
  // }

  // private emit(event: string, ...args: unknown[]): boolean {
  //   if (this.gameModel === null) {
  //     throw new Error(`Service ${this.constructor.name} is not initialized`);
  //   }
  //   // console.log('emit', args[0]);
  //   if (!this.metadata.emitEvents.includes(event)) {
  //     throw new Error(`Event ${event} is not in emit events list of ${this.constructor.name}`);
  //   }
  //   return this.gameModel.emit(event, ...args);
  // }

  // emit2(event: EmitEvent): boolean {
  emit2(event: F["EmitEvent"]): boolean {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    // console.log('emit', args[0]);
    if (!this.metadata.emitEvents.includes(event.type)) {
      throw new Error(`Event ${event} is not in emit events list of ${this.constructor.name}`);
    }
    return this.gameModel.emit(event.type, event);
  }

  // on(event: string, listener: (...args: unknown[]) => void): GameModel {
  // private on(event: string, listener: (...args: any[]) => void): GameModel {
  //   if (this.gameModel === null) {
  //     throw new Error(`Service ${this.constructor.name} is not initialized`);
  //   }
  //   if (!this.metadata.listenEvents.includes(event)) {
  //     throw new Error(`Event ${event} is not in listen events list of ${this.constructor.name}`);
  //   }
  //   return this.gameModel.on(event, listener);
  // }

  // on2<T extends ListenEvent>(event: T["type"], listener: (arg: T) => void): GameModel {
  on2<T extends F["ListenEvent"]>(event: T["type"], listener: (arg: T) => void): GameModel {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    if (!this.metadata.listenEvents.includes(event)) {
      throw new Error(`Event ${event} is not in listen events list of ${this.constructor.name}`);
    }
    return this.gameModel.on(event, listener);
  }

  // off(event: string, listener: (...args: unknown[]) => void): GameModel {
  // private off(event: string, listener: (...args: any[]) => void): GameModel {
  //   if (this.gameModel === null) {
  //     throw new Error(`Service ${this.constructor.name} is not initialized`);
  //   }
  //   if (!this.metadata.listenEvents.includes(event)) {
  //     throw new Error(`Event ${event} is not in listen events list of ${this.constructor.name}`);
  //   }
  //   return this.gameModel.off(event, listener);
  // }

  off2<T extends F["ListenEvent"]>(event: T["type"], listener: (arg: T) => void): GameModel {
    // return this.off(event, listener);
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    if (!this.metadata.listenEvents.includes(event)) {
      throw new Error(`Event ${event} is not in listen events list of ${this.constructor.name}`);
    }
    return this.gameModel.off(event, listener);
  }

  // getFromModel(rawRequest: GMRequest | string) {
  //   const request: GMRequest = stringToType<GMRequest>(rawRequest);

  //   const { needRequests } = this.metadata;
  //   if (needRequests && !needRequests.includes(request.type)) {
  //     throw new Error(`Request ${request.type} is not expected from ${this.constructor.name}`);
  //   }

  //   return this.gameModel.get(rawRequest);
  // }
  /**
   * @deprecated Use getFromModel instead
   */
  getFromModel<T extends GMRequest, K>(rawRequest: T | string): K {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    const request: T = stringToType<T>(rawRequest);

    const { needRequests } = this.metadata;
    if (needRequests && !needRequests.includes(request.type)) {
      throw new Error(`Request ${request.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.get(rawRequest) as K;
  }

  // getFromFacade<P extends Parameters<G>[0]>(opts: P): ReturnType<Extract<G, (arg: P) => any>> {
  //   return null!;
  // }

  // Old code
  // getFromModel2<T extends F["NeedRequest"]>(rawRequest: Req<T>): Res<T> {

  // applied solution from my stackoverflow question
  // https://stackoverflow.com/questions/67855373/how-to-apply-discriminating-union-technique-to-function-signatures/67855435?noredirect=1
  getFromModel2<T extends Req<F["NeedRequest"]>>(rawRequest: T): Res<Extract<F["NeedRequest"], (arg: T) => any>> {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    const request: T = stringToType<T>(rawRequest);
    const { needRequests } = this.metadata;
    if (needRequests && !needRequests.includes(request.type)) {
      throw new Error(`Request ${request.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.get(request);
  }

  /**
   * @deprecated Use executeOnModel2 instead
   */
  executeOnModel<T extends GMAction, K>(rawAction: T | string): K {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    const action: T = stringToType<T>(rawAction);

    const { needActions } = this.metadata;
    if (needActions && !needActions.includes(action.type)) {
      throw new Error(`Action ${action.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.execute(rawAction) as K;
  }

  executeOnModel2<T extends F["NeedAction"], K = never>(rawAction: T | string): K {
    if (this.gameModel === null) {
      throw new Error(`Service ${this.constructor.name} is not initialized`);
    }
    const action: T = stringToType<T>(rawAction);

    const { needActions } = this.metadata;
    if (needActions && !needActions.includes(action.type)) {
      throw new Error(`Action ${action.type} is not expected from ${this.constructor.name}`);
    }

    return this.gameModel.execute(rawAction) as K;
  }

  // setMetadata(metadata: Metadata): void {
  setMetadata(metadata: ServiceContractTypes<F>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }
}
