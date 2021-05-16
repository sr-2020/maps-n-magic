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
import { AbstractEventProcessor } from "./AbstractEventProcessor";

export class StubEventProcessor extends AbstractEventProcessor {
  public constructor(gameModel: GameModel, logger: GMLogger, metadata: Partial<EventProcessorMetadata>) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }
}