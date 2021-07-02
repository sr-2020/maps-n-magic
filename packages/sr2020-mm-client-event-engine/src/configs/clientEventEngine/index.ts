import { 
  EventEngine,
  LocationRecordService,
  BeaconRecordService,
  // NotificationService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanEnableService,
  SpiritMovementEnableService,
  SpiritService,
  SpiritFractionService,
  SpiritRouteService,
  StubEventProcessor,
  GameModel,
} from 'sr2020-mm-event-engine';

// import { Migrator } from './Migrator';

// import { UserService } from '../../services/UserService';
// import { BotService } from '../../services/BotService/BotService';
// import { TickerService } from '../../services/TickerService';
// import { SpiritService } from '../../services/SpiritService';
// import { SoundService2 } from '../../services/SoundService2';
import { SoundStageService } from '../../services/SoundStageService';
// import { BeaconService } from '../../services/BeaconService';
// import { LocationService } from '../../services/LocationService';
// import { SoundMappingService } from '../../services/SoundMappingService';
// import { UserWatcher } from '../../services/UserWatcher';
import { BaseVersion } from '../../services/BaseVersion';
import { BackgroundImageService } from '../../services/BackgroundImageService';
// import { ManaOceanStubService } from '../../services/ManaOceanStubService';
import { TrackedCharacterService } from '../../services/TrackedCharacterService';

// import { fillGameModelWithBots } from './GameModelFiller';
import { WsDataBinding } from '../../dataManagers/WsDataBinding';

import { WSConnector } from '../../api/WSConnector';

const services = [
  // UserService,
  // BotService,
  // TickerService,
  SpiritService,
  SpiritFractionService,
  SpiritRouteService,
  // SoundService2,
  SoundStageService,
  // BeaconService,
  // LocationService,
  LocationRecordService,
  // SoundMappingService,
  // UserWatcher,
  BaseVersion,
  BeaconRecordService,
  // NotificationService,
  BackgroundImageService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanEnableService,
  SpiritMovementEnableService,
  // ManaOceanStubService,
  TrackedCharacterService,
];

export function makeGameModel(ignoreClientMessages: boolean = false): {
  gameModel: GameModel, gameServer: EventEngine
} {
  // @ts-ignore
  const gameServer = new EventEngine(services, console);
  // gameServer.setData(database);
  const gameModel = gameServer.getGameModelImpl();
  // fillGameModelWithBots(gameModel);

  const wsConnection = new WSConnector(gameModel);
  gameServer.addDataBinding(new WsDataBinding(gameModel, wsConnection, console, ignoreClientMessages));

  gameServer.addDataBinding(new StubEventProcessor(
    gameModel, 
    console, {
      emitEvents: [
        // confirmations received from server
        "putCharHealthConfirmed",
        "putCharLocationConfirmed",
        "enableManaOceanConfirmed",
        "enableSpiritMovementConfirmed",
        // SpiritService - these events are required by SpiritService
        // but they are not in s2c (server-to-client) forward list
        // so just stub them
        "postSpiritConfirmed",
        "putSpiritConfirmed",
        "putSpiritsConfirmed",
        "deleteSpiritConfirmed",
        // SpiritService - will be produced by client, not by game model
        "postSpiritRequested",
        "putSpiritRequested",
        "deleteSpiritRequested",
        "cloneSpiritRequested",
        // SpiritFractionService - these events are required by SpiritFractionService
        // but they are not in s2c (server-to-client) forward list
        // so just stub them
        "putSpiritFractionConfirmed",
        // SpiritFractionService - will be produced by client, not by game model
        "putSpiritFractionRequested",

        // SpiritRouteService
        "postSpiritRouteConfirmed",
        "putSpiritRouteConfirmed",
        "deleteSpiritRouteConfirmed",
        "postSpiritRouteRequested",
        "putSpiritRouteRequested",
        "deleteSpiritRouteRequested",
        "cloneSpiritRouteRequested",

        // used to forward character health states from server to client
        "setCharacterHealthStates",
        // expected from server
        "characterLocationChanged",
        // such messages can be recieved from server to inform user about something
        "postNotification",
        // misc events produced by client
        "putCharHealthRequested",
        "wipeManaOceanEffects",
        "removeManaEffect",
        "addManaEffect",
        "emitCharacterLocationChanged",
        "reloadUserRecords",
        
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}
