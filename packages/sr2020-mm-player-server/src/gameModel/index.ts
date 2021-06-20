import { 
  EventEngine, 
  GameModel, 
  LocationRecordService,
  SpiritService,
  StubEventProcessor
} from "sr2020-mm-event-engine";

import { 
  winstonLogger as rootLogger 
} from "sr2020-mm-server-event-engine";

const services = [
  LocationRecordService,
  SpiritService,
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
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}