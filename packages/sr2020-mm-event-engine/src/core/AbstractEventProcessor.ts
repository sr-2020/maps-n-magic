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
  
  public init() {}

  public dispose() {}

  public setMetadata(metadata: Partial<EventProcessorMetadata>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  public getMetadata(): EventProcessorMetadata {
    return this.metadata;
  }
}