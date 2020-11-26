// import { Migrator } from './Migrator';

// import { UserService } from '../../services/UserService';
// import { BotService } from '../../services/BotService/BotService';
// import { TickerService } from '../../services/TickerService';
// import { SpiritService } from '../../services/SpiritService';
// import { SoundService2 } from '../../services/SoundService2';
// import { SoundStageService } from '../../services/SoundStageService';
// import { BeaconService } from '../../services/BeaconService';
// import { LocationService } from '../../services/LocationService';
import { LocationRecordService } from '../../services/LocationRecordService';
// import { SoundMappingService } from '../../services/SoundMappingService';
// import { UserWatcher } from '../../services/UserWatcher';
// import { BaseVersion } from '../../services/BaseVersion';
import { BeaconRecordService } from '../../services/BeaconRecordService';
import { NotificationService } from '../../services/NotificationService';
// import { BackgroundImageService } from '../../services/BackgroundImageService';
import { CharacterHealthStateService } from '../../services/CharacterHealthStateService';
// import { UserRecordService } from '../../services/UserRecordService';
// import { ManaOceanSettingsService } from '../../services/ManaOceanSettingsService';
import { SettingsService } from '../../services/SettingsService';
import { ManaOceanService } from '../../services/ManaOceanService';
import { ManaOceanEnableService } from '../../services/ManaOceanEnableService';
import { MassacreService } from '../../services/MassacreService';
import { PushNotificationService } from '../../services/PushNotificationService';
import { AudioStageService } from '../../services/AudioStageService';
import { CharacterLocationService } from '../../services/CharacterLocationService';
import { RescueServicePushService } from '../../services/RescueServicePushService';

// // import { fillGameModelWithBots } from './GameModelFiller';
import { CrudDataManager } from '../../dataManagers/CrudDataManager';
import { LocationDataManager } from '../../dataManagers/LocationDataManager';
// import { ReadDataManager } from '../../dataManagers/ReadDataManager';
import { SettingsDataManager } from '../../dataManagers/SettingsDataManagers';
// import { SingleReadStrategy } from '../../dataManagers/SingleReadStrategy';
import { PollingReadStrategy } from '../../dataManagers/PollingReadStrategy';
import { DataBinding } from '../../dataManagers/DataBinding';
import { RedirectDataBinding } from '../../dataManagers/RedirectDataBinding';
import { CharacterLocDataManager } from '../../dataManagers/CharacterLocDataManager';

import { defaultManaOceanSettings, manaOceanEffectSettings } from '../../api/constants';

import {
  RemoteLocationRecordProvider as LocationRecordProvider,
  RemoteBeaconRecordProvider as BeaconRecordProvider,
  RemoteUsersRecordProvider as UserRecordProvider,
  ManaOceanSettingsProvider,
  ManaOceanEffectSettingsProvider,
} from '../../api/position';

import { CharacterStatesListener } from '../../api/characterStates/CharacterStatesListener';
import { CharacterLocationListener } from '../../api/position/CharacterLocationListener';
import { SpellCastsListener } from '../../api/spellCasts/SpellCastsListener';
import { PushNotificationEmitter } from '../../api/pushNotificationEmitter';

import { EventEngine } from '../../core/EventEngine';

import { winstonLogger } from '../../utils/winstonLogger';

const services = [
  // UserService,
  // BotService,
  // TickerService,
  // SpiritService,
  // SoundService2,
  // SoundStageService,
  // BeaconService,
  // LocationService,
  LocationRecordService,
  // SoundMappingService,
  // UserWatcher,
  // BaseVersion,
  BeaconRecordService,
  NotificationService,
  // BackgroundImageService,
  CharacterHealthStateService,
  // UserRecordService,
  // ManaOceanSettingsService,
  SettingsService,
  ManaOceanService,
  ManaOceanEnableService,
  MassacreService,
  PushNotificationService,
  AudioStageService,
  CharacterLocationService,
  RescueServicePushService,
];

// eslint-disable-next-line max-lines-per-function
export function makeGameModel(database) {
  // const gameServer = new EventEngine(services, console);
  const gameServer = new EventEngine(services, winstonLogger);
  gameServer.setData(database);
  const gameModel = gameServer.getGameModel();
  // fillGameModelWithBots(gameModel);

  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'beaconRecord',
    DataProvider: BeaconRecordProvider,
    DataManager: CrudDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
  }));
  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'locationRecord',
    DataProvider: LocationRecordProvider, // Implements primitive REST API calls
    DataManager: LocationDataManager, // transform REST results to GM events and vice versa
    ReadStrategy: PollingReadStrategy, // implements read strategy, used deep inside in data manager read part
    ReadStrategyArgs: [15000],
  }));
  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'userRecord',
  //   DataProvider: UserRecordProvider,
  //   DataManager: ReadDataManager,
  //   ReadStrategy: PollingReadStrategy,
  //   ReadStrategyArgs: [15000, 'reloadUserRecords'],
  // }));
  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'manaOcean',
    DataProvider: ManaOceanSettingsProvider,
    DataManager: SettingsDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
    defaultSettings: defaultManaOceanSettings,
    logger: winstonLogger,
  }));
  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'manaOceanEffects',
    DataProvider: ManaOceanEffectSettingsProvider,
    DataManager: SettingsDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
    defaultSettings: manaOceanEffectSettings,
    logger: winstonLogger,
  }));

  const charLocDM = new CharacterLocDataManager(
    gameModel,
    winstonLogger,
  );
  charLocDM.initialize();
  gameServer.addDataBinding(charLocDM);
  gameServer.addDataBinding(new RedirectDataBinding(
    gameModel,
    {
      putCharHealthRequested: 'putCharHealthConfirmed',
      putCharLocationRequested: 'putCharLocationConfirmed',
      enableManaOceanRequested: 'enableManaOceanConfirmed',
    },
  ));
  const characterStatesListener = new CharacterStatesListener(gameModel);
  const characterLocationListener = new CharacterLocationListener(gameModel);
  const spellCastsListener = new SpellCastsListener(gameModel);
  const pushNotificationEmitter = new PushNotificationEmitter(gameModel, winstonLogger);
  pushNotificationEmitter.initialize();
  return { gameModel, gameServer };
}
