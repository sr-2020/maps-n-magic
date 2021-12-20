import * as R from 'ramda';

import { 
  Metadata, 
  GMAction, 
  GMRequest, 
  GMLogger,
  GMEvent,
  EventProcessorMetadata,
  DefaultGMEvent
} from "./types";

import { GameModel } from "./GameModel";

export class AbstractEventProcessor<
  EmitEvent extends GMEvent = DefaultGMEvent,
  ListenEvent extends GMEvent = DefaultGMEvent,
> {
  private metadata: EventProcessorMetadata = {
    emitEvents: [],
    listenEvents: [],
  };

  public constructor(protected gameModel: GameModel, protected logger: GMLogger) {}

  public getName() {
    return this.constructor.name;
  }
  
  public init() {}

  public dispose() {}

  public setMetadata(metadata: Partial<EventProcessorMetadata>): void {
    if (metadata.emitEvents) {
      this.metadata.emitEvents = R.uniq([
        ...this.metadata.emitEvents, 
        ...metadata.emitEvents
      ]);
    }
    if (metadata.listenEvents) {
      this.metadata.listenEvents = R.uniq([
        ...this.metadata.listenEvents, 
        ...metadata.listenEvents
      ]);
    }
  }

  public getMetadata(): EventProcessorMetadata {
    return this.metadata;
  }
}