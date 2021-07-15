import { 
  EventEngine, 
  GameModel, 
  LocationRecordService,
  SpiritService,
  SpiritFractionService,
  StubEventProcessor,
  UserRecordService,
} from "sr2020-mm-event-engine";

import { 
  winstonLogger as rootLogger,
  SpiritCatcherService
} from "sr2020-mm-server-event-engine";

import { LocationDataService } from "./LocationDataService";
import { SuitedSpiritsService } from "./SuitedSpiritsService";

const services = [
  LocationRecordService,
  SpiritService,
  SpiritFractionService,
  UserRecordService,
  LocationDataService,
  SuitedSpiritsService,
  SpiritCatcherService,
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
        // spell cast processed on main server
        'spellCast',
        // sended from main server
        'setCatcherStates',
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}