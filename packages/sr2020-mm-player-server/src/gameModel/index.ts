import { 
  EventEngine, 
  GameModel, 
  LocationRecordService,
  SpiritService,
  SpiritFractionService,
  StubEventProcessor,
  UserRecordService,
  FeatureService,
  // SpiritPhraseService,
} from "sr2020-mm-event-engine";

import { 
  winstonLogger as rootLogger,
  SpiritCatcherService
} from "sr2020-mm-server-event-engine";

import { LocationDataService } from "./LocationDataService";
import { SuitedSpiritsService } from "./SuitedSpiritsService";
import { MessageService } from "./MessageService";

const services = [
  LocationRecordService,
  SpiritService,
  SpiritFractionService,
  UserRecordService,
  LocationDataService,
  SuitedSpiritsService,
  SpiritCatcherService,
  FeatureService,
  MessageService,
  // SpiritPhraseService,
];

export function makeGameModel(): {
  gameModel: GameModel, gameServer: EventEngine
} {

  // @ts-ignore
  const gameServer = new EventEngine(services, rootLogger);
  const gameModel = gameServer.getGameModelImpl();

  gameServer.addDataBinding(new StubEventProcessor(
    gameModel, 
    rootLogger, {
      emitEvents: [
        'postSpiritConfirmed',
        'putSpiritConfirmed',
        'deleteSpiritConfirmed',
        'setSpirits',
        'cloneSpiritRequested',
        'putSpiritsConfirmed',
        'putSpiritFractionConfirmed',
        'setSpiritFractions',
        // 'postSpiritPhraseConfirmed',
        // 'putSpiritPhraseConfirmed',
        // 'deleteSpiritPhraseConfirmed',
        // spell cast processed on main server
        'spellCast',
        // sended from main server sse
        'setCatcherStates',
        'setFeatures',
        // 'setSpiritPhrases'
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}