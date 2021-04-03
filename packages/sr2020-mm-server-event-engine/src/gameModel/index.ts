import { 
  EventEngine,
  LocationRecordService,
  BeaconRecordService,
  NotificationService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanEnableService,
  AbstractService,
  BeaconRecord,
  LocationRecord,
  UserRecord,
  ManaOceanSettingsData,
  ManaOceanEffectSettingsData
} from 'sr2020-mm-event-engine';

import { ManaOceanService } from '../services/ManaOceanService';
import { MassacreService } from '../services/MassacreService';
import { PushNotificationService } from '../services/PushNotificationService';
import { AudioStageService } from '../services/AudioStageService';
import { CharacterLocationService } from '../services/CharacterLocationService';
import { RescueServicePushService } from '../services/RescueServicePushService';

import { CrudDataManager } from '../dataManagers/CrudDataManager';
import { LocationDataManager } from '../dataManagers/LocationDataManager';
import { ReadDataManager } from '../dataManagers/ReadDataManager';
import { SettingsDataManager } from '../dataManagers/SettingsDataManagers';
import { PollingReadStrategy } from '../dataManagers/PollingReadStrategy';
// import { DataBinding } from '../dataManagers/DataBinding';
import { RedirectDataBinding } from '../dataManagers/RedirectDataBinding';
import { CharacterLocDataManager } from '../dataManagers/CharacterLocDataManager';

import { defaultManaOceanSettings, manaOceanEffectSettings } from '../api/constants';

import { winstonLogger as rootLogger } from "./winstonLogger";

import {
  RemoteLocationRecordProvider as LocationRecordProvider,
  RemoteBeaconRecordProvider as BeaconRecordProvider,
  RemoteUsersRecordProvider as UserRecordProvider,
  ManaOceanSettingsProvider,
  ManaOceanEffectSettingsProvider,
  ManageablePlusResourceProvider,
  ManageableResourceProvider
} from '../api/position';

import { CharacterStatesListener } from '../api/characterStates/CharacterStatesListener';
import { CharacterLocationListener } from '../api/position/CharacterLocationListener';
import { SpellCastsListener } from '../api/spellCasts/SpellCastsListener';
import { PushNotificationEmitter } from '../api/pushNotificationEmitter';

const services = [
  LocationRecordService,
  BeaconRecordService,
  NotificationService,
  CharacterHealthStateService,
  UserRecordService,
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
export function makeGameModel() {
  // const gameServer = new EventEngine(services, console);
  // @ts-ignore
  const gameServer = new EventEngine(services, rootLogger);
  // const gameServer = new EventEngine([], rootLogger);
  // gameServer.setData(database);
  const gameModel = gameServer.getGameModel();
  // fillGameModelWithBots(gameModel);

  const beaconRecordLogger = rootLogger.customChild(rootLogger, { service: 'BeaconRecordDB' });
  const beaconRecordDataBinding = new CrudDataManager<BeaconRecord, BeaconRecordProvider>(
    gameModel,
    new BeaconRecordProvider(),
    'beaconRecord',
    new PollingReadStrategy(gameModel, 15000, beaconRecordLogger),
    beaconRecordLogger
  );
  beaconRecordDataBinding.initialize();
  gameServer.addDataBinding(beaconRecordDataBinding);

  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'beaconRecord',
  //   DataProvider: BeaconRecordProvider,
  //   DataManager: CrudDataManager,
  //   ReadStrategy: PollingReadStrategy,
  //   ReadStrategyArgs: [15000],
  // }));

  const locationRecordDataBinding = new LocationDataManager<LocationRecord, LocationRecordProvider>(
    gameModel,
    new LocationRecordProvider(),
    'locationRecord',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  locationRecordDataBinding.initialize();
  gameServer.addDataBinding(locationRecordDataBinding);

  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'locationRecord',
  //   DataProvider: LocationRecordProvider, // Implements primitive REST API calls
  //   DataManager: LocationDataManager, // transform REST results to GM events and vice versa
  //   ReadStrategy: PollingReadStrategy, // implements read strategy, used deep inside in data manager read part
  //   ReadStrategyArgs: [15000],
  // }));

  const userRecordDataBinding = new ReadDataManager<UserRecord, UserRecordProvider>(
    gameModel,
    new UserRecordProvider(),
    'userRecord',
    new PollingReadStrategy(gameModel, 15000, rootLogger, 'reloadUserRecords'),
    rootLogger
  );
  userRecordDataBinding.initialize();
  gameServer.addDataBinding(userRecordDataBinding);


  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'userRecord',
  //   DataProvider: UserRecordProvider,
  //   // DataProvider: UsersRecordProviderMock,
  //   DataManager: ReadDataManager,
  //   ReadStrategy: PollingReadStrategy,
  //   ReadStrategyArgs: [15000, 'reloadUserRecords'],
  // }));

  const manaOceanSettingsDB = new SettingsDataManager<ManaOceanSettingsData, ManaOceanSettingsProvider>(
    gameModel,
    new ManaOceanSettingsProvider(),
    'manaOcean',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    {
      defaultSettings: defaultManaOceanSettings,
      logger: rootLogger,
    }
  );
  manaOceanSettingsDB.initialize();
  gameServer.addDataBinding(manaOceanSettingsDB);

  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'manaOcean',
  //   DataProvider: ManaOceanSettingsProvider,
  //   DataManager: SettingsDataManager,
  //   ReadStrategy: PollingReadStrategy,
  //   ReadStrategyArgs: [15000],
  //   defaultSettings: defaultManaOceanSettings,
  //   logger: rootLogger,
  // }));

  const manaOceanEffectsSettingsDB = new SettingsDataManager<ManaOceanEffectSettingsData, ManaOceanEffectSettingsProvider>(
    gameModel,
    new ManaOceanEffectSettingsProvider(),
    'manaOceanEffects',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    {
      defaultSettings: manaOceanEffectSettings,
      logger: rootLogger,
    }
  );
  manaOceanEffectsSettingsDB.initialize();
  gameServer.addDataBinding(manaOceanEffectsSettingsDB);

  // gameServer.addDataBinding(new DataBinding({
  //   gameModel,
  //   entityName: 'manaOceanEffects',
  //   DataProvider: ManaOceanEffectSettingsProvider,
  //   DataManager: SettingsDataManager,
  //   ReadStrategy: PollingReadStrategy,
  //   ReadStrategyArgs: [15000],
  //   defaultSettings: manaOceanEffectSettings,
  //   logger: rootLogger,
  // }));

  const charLocDM = new CharacterLocDataManager(
    gameModel,
    rootLogger,
  );
  charLocDM.initialize();
  gameServer.addDataBinding(charLocDM);

  // const metadata = {
  //   actions: [],
  //   requests: [],
  //   emitEvents: [],
  //   listenEvents: [arg keys],
  //   needRequests: [],
  //   needActions: [arg values]
  // };
  
  gameServer.addDataBinding(new RedirectDataBinding(
    gameModel,
    {
      putCharHealthRequested: 'putCharHealthConfirmed',
      putCharLocationRequested: 'putCharLocationConfirmed',
      enableManaOceanRequested: 'enableManaOceanConfirmed',
    },
    rootLogger
  ));
  const characterStatesListener = new CharacterStatesListener(gameModel);
  const characterLocationListener = new CharacterLocationListener(gameModel);
  const spellCastsListener = new SpellCastsListener(gameModel);
  const pushNotificationEmitter = new PushNotificationEmitter(gameModel, rootLogger);
  pushNotificationEmitter.initialize();
  return { gameModel, gameServer };
}
