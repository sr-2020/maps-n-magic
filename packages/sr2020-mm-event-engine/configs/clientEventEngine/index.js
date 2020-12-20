import { Migrator } from './Migrator';

import { LocationRecordService } from '../../services/LocationRecordService';
import { BeaconRecordService } from '../../services/BeaconRecordService';
import { NotificationService } from '../../services/NotificationService';
import { CharacterHealthStateService } from '../../services/CharacterHealthStateService';
import { UserRecordService } from '../../services/UserRecordService';
import { SettingsService } from '../../services/SettingsService';
import { ManaOceanEnableService } from '../../services/ManaOceanEnableService';

import { UserService } from '../../services/UserService';
import { BotService } from '../../services/BotService/BotService';
import { TickerService } from '../../services/TickerService';
import { SpiritService } from '../../services/SpiritService';
import { SoundService2 } from '../../services/SoundService2';
import { SoundStageService } from '../../services/SoundStageService';
import { BeaconService } from '../../services/BeaconService';
import { LocationService } from '../../services/LocationService';
import { SoundMappingService } from '../../services/SoundMappingService';
import { UserWatcher } from '../../services/UserWatcher';
import { BaseVersion } from '../../services/BaseVersion';
import { BackgroundImageService } from '../../services/BackgroundImageService';
import { ClientEventStubService } from '../../services/ClientEventStubService';
import { CharacterWatchService } from '../../services/CharacterWatchService';

import { fillGameModelWithBots } from './GameModelFiller';
import { WsDataBinding } from '../../dataManagers/WsDataBinding';

import { WSConnector } from '../../api/wsConnection';

import { EventEngine } from '../../core/EventEngine';

const services = [
  UserService,
  BotService,
  TickerService,
  SpiritService,
  SoundService2,
  SoundStageService,
  BeaconService,
  LocationService,
  LocationRecordService,
  SoundMappingService,
  UserWatcher,
  BaseVersion,
  BeaconRecordService,
  NotificationService,
  BackgroundImageService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanEnableService,
  ClientEventStubService,
  CharacterWatchService,
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
