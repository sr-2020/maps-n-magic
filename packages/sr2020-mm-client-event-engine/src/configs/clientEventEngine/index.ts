import { LocationRecordService } from 'sr2020-mm-event-engine/services/LocationRecordService';
import { BeaconRecordService } from 'sr2020-mm-event-engine/services/BeaconRecordService';
import { NotificationService } from 'sr2020-mm-event-engine/services/NotificationService';
import { CharacterHealthStateService } from 'sr2020-mm-event-engine/services/CharacterHealthStateService';
import { UserRecordService } from 'sr2020-mm-event-engine/services/UserRecordService';
import { SettingsService } from 'sr2020-mm-event-engine/services/SettingsService';
import { ManaOceanEnableService } from 'sr2020-mm-event-engine/services/ManaOceanEnableService';

import { EventEngine } from 'sr2020-mm-event-engine/core/EventEngine';

import { Migrator } from './Migrator';

// import { UserService } from '../../services/UserService';
// import { BotService } from '../../services/BotService/BotService';
// import { TickerService } from '../../services/TickerService';
// import { SpiritService } from '../../services/SpiritService';
import { SoundService2 } from '../../services/SoundService2';
import { SoundStageService } from '../../services/SoundStageService';
import { BeaconService } from '../../services/BeaconService';
// import { LocationService } from '../../services/LocationService';
import { SoundMappingService } from '../../services/SoundMappingService';
// import { UserWatcher } from '../../services/UserWatcher';
import { BaseVersion } from '../../services/BaseVersion';
import { BackgroundImageService } from '../../services/BackgroundImageService';
import { ClientEventStubService } from '../../services/ClientEventStubService';
import { CharacterWatchService } from '../../services/CharacterWatchService';

import { fillGameModelWithBots } from './GameModelFiller';
import { WsDataBinding } from '../../dataManagers/WsDataBinding';

import { WSConnector } from '../../api/wsConnection';

const services = [
  // new UserService(),
  // new BotService(),
  // new TickerService(),
  // new SpiritService(),
  new SoundService2(),
  new SoundStageService(),
  new BeaconService(),
  // new LocationService(),
  new LocationRecordService(),
  new SoundMappingService(),
  // new UserWatcher(),
  new BaseVersion(),
  new BeaconRecordService(),
  new NotificationService(),
  new BackgroundImageService(),
  new CharacterHealthStateService(),
  new UserRecordService(),
  new SettingsService(),
  new ManaOceanEnableService(),
  new ClientEventStubService(),
  new CharacterWatchService(),
];

export function makeGameModel(database) {
  const gameServer = new EventEngine(services, console, Migrator);
  gameServer.setData(database);
  const gameModel = gameServer.getGameModel();
  fillGameModelWithBots(gameModel);

  const wsConnection = new WSConnector(gameModel);
  gameServer.addDataBinding(new WsDataBinding({
    gameModel, wsConnection,
  }));
  return { gameModel, gameServer };
}
