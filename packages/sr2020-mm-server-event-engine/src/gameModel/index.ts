import { 
  // services
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
  FeatureService,
  
  // 
  EventEngine,
  AbstractService,
  BeaconRecord,
  LocationRecord,
  UserRecord,
  RawUserRecord,
  ManaOceanSettingsData,
  ManaOceanEffectSettingsData,
  StubEventProcessor,
  Feature,
  // redirect events
  EPutCharHealthRequested,
  EPutCharHealthConfirmed,
  EPutCharLocationRequested,
  EPutCharLocationConfirmed,
  EEnableManaOceanRequested,
  EEnableManaOceanConfirmed,
  GameModel,
  Spirit,
  SpiritFraction,
  SpiritRoute,
  EEnableSpiritMovementRequested,
  EEnableSpiritMovementConfirmed,
} from 'sr2020-mm-event-engine';

import { ManaOceanService } from '../services/ManaOceanService';
import { MassacreService } from '../services/MassacreService';
import { PushNotificationService } from '../services/PushNotificationService';
import { AudioStageService } from '../services/AudioStageService';
import { CharacterLocationService } from '../services/CharacterLocationService';
import { SpiritMovementService } from '../services/SpiritMovementService';
import { SpiritCatcherService } from '../services/SpiritCatcherService';
import { SpiritCatcherUpdateService } from '../services/SpiritCatcherUpdateService';
// Push notifications delivery was unstable so decided to disable this feature
// if we don't have better solution.
// For details see https://trello.com/c/giDbdVGa/628-фантомные-кс-пуши-в-уведомлении
// import { RescueServicePushService } from '../services/RescueServicePushService';

import { CrudDataManager } from '../dataManagers/CrudDataManager';
import { LocationDataManager } from '../dataManagers/LocationDataManager';
import { ReadDataManager } from '../dataManagers/ReadDataManager';
import { ReadDataManager2 } from '../dataManagers/ReadDataManager2';
import { CrudDataManager2, CrudDataManagerPlus2 } from '../dataManagers/CrudDataManager2';
import { SettingsDataManager } from '../dataManagers/SettingsDataManagers';
import { PollingReadStrategy } from '../dataManagers/PollingReadStrategy';
// import { DataBinding } from '../dataManagers/DataBinding';
import { RedirectDataBinding } from '../dataManagers/RedirectDataBinding';
import { RedirectDataBinding2, StrictEventBinding } from '../dataManagers/RedirectDataBinding2';
import { CharacterLocDataManager } from '../dataManagers/CharacterLocDataManager';

import { defaultManaOceanSettings, manaOceanEffectSettings } from '../api/constants';

import {
  RemoteLocationRecordProvider as LocationRecordProvider,
  RemoteBeaconRecordProvider as BeaconRecordProvider,
  RemoteUsersRecordProvider as UserRecordProvider,
  ManageablePlusResourceProvider,
  ManageableResourceProvider
} from '../api/position';

import {  
  ManaOceanSettingsProvider,
  ManaOceanEffectSettingsProvider,
} from "../api/settings";

import { CharacterStatesListener } from '../api/characterStates/CharacterStatesListener';
import { CharacterLocationListener } from '../api/position/CharacterLocationListener';
import { SpellCastsListener } from '../api/spellCasts/SpellCastsListener';
import { PushNotificationEmitter } from '../api/pushNotificationEmitter';
import { SpiritProvider, SpiritFractionProvider, SpiritRouteProvider } from '../api/spirits';
import { createLogger } from '../logger';
import { FeatureProvider } from '../api/features';
import { ModelManagetLocInitializer } from '../services/ModelManagetLocInitializer';

type EventBindingList = 
  | StrictEventBinding<EPutCharHealthRequested, EPutCharHealthConfirmed>
  | StrictEventBinding<EPutCharLocationRequested, EPutCharLocationConfirmed>
  | StrictEventBinding<EEnableManaOceanRequested, EEnableManaOceanConfirmed>
  | StrictEventBinding<EEnableSpiritMovementRequested, EEnableSpiritMovementConfirmed>
;

const services = [
  LocationRecordService,
  BeaconRecordService,
  // NotificationService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanService,
  ManaOceanEnableService,
  SpiritMovementEnableService,
  MassacreService,
  PushNotificationService,
  AudioStageService,
  CharacterLocationService,
  SpiritService,
  SpiritFractionService,
  SpiritRouteService,
  SpiritMovementService,
  FeatureService,
  ModelManagetLocInitializer,
  SpiritCatcherService,
  SpiritCatcherUpdateService,
  // RescueServicePushService,
];

// eslint-disable-next-line max-lines-per-function
export function makeGameModel(): {
  gameModel: GameModel, gameServer: EventEngine
} {
  // const gameServer = new EventEngine(services, console);
  // @ts-ignore
  const gameServer = new EventEngine(services, createLogger('eventEngine'));
  // const gameServer = new EventEngine([], rootLogger);
  // gameServer.setData(database);
  const gameModel = gameServer.getGameModelImpl();
  // fillGameModelWithBots(gameModel);

  const beaconRecordLogger = createLogger('beaconRecordDataBinding');
  const beaconRecordDataBinding = new CrudDataManager<BeaconRecord, BeaconRecordProvider>(
    gameModel,
    new BeaconRecordProvider(),
    'beaconRecord',
    new PollingReadStrategy(gameModel, 15000, beaconRecordLogger),
    beaconRecordLogger
  );
  beaconRecordDataBinding.init();
  gameServer.addDataBinding(beaconRecordDataBinding);

  const locationRecordLogger = createLogger('locationRecordDataBinding');
  const locationRecordDataBinding = new LocationDataManager<LocationRecord, LocationRecordProvider>(
    gameModel,
    new LocationRecordProvider(),
    'locationRecord',
    new PollingReadStrategy(gameModel, 15000, locationRecordLogger),
    locationRecordLogger
  );
  locationRecordDataBinding.init();
  gameServer.addDataBinding(locationRecordDataBinding);

  const spiritLogger = createLogger('spiritDataBinding');
  const spiritDataBinding = new CrudDataManagerPlus2<Spirit, SpiritProvider>(
    gameModel,
    new SpiritProvider(),
    'spirit',
    new PollingReadStrategy(gameModel, 15000, spiritLogger),
    spiritLogger
  );
  spiritDataBinding.init();
  gameServer.addDataBinding(spiritDataBinding);

  const spiritFractionLogger = createLogger('spiritFractionDataBinding');
  const spiritFractionDataBinding = new CrudDataManager2<SpiritFraction, SpiritFractionProvider>(
    gameModel,
    new SpiritFractionProvider(),
    'spiritFraction',
    new PollingReadStrategy(gameModel, 15000, spiritFractionLogger),
    spiritFractionLogger
  );
  spiritFractionDataBinding.init();
  gameServer.addDataBinding(spiritFractionDataBinding);

  const spiritRouteLogger = createLogger('spiritRouteDataBinding');
  const spiritRouteDataBinding = new CrudDataManager2<SpiritRoute, SpiritRouteProvider>(
    gameModel,
    new SpiritRouteProvider(),
    'spiritRoute',
    new PollingReadStrategy(gameModel, 15000, spiritRouteLogger),
    spiritRouteLogger
  );
  spiritRouteDataBinding.init();
  gameServer.addDataBinding(spiritRouteDataBinding);

  const userRecordLogger = createLogger('userRecordDataBinding');
  const userRecordDataBinding = new ReadDataManager<RawUserRecord, UserRecordProvider>(
    gameModel,
    new UserRecordProvider(),
    'userRecord',
    new PollingReadStrategy(gameModel, 15000, userRecordLogger, 'reloadUserRecords'),
    userRecordLogger
  );
  userRecordDataBinding.init();
  gameServer.addDataBinding(userRecordDataBinding);

  const featureLogger = createLogger('featureDataBinding');
  const featureDataBinding = new ReadDataManager2<Feature, FeatureProvider>(
    gameModel,
    new FeatureProvider(),
    'feature',
    new PollingReadStrategy(gameModel, 60 * 60 * 1000, featureLogger), // 1 hour
    featureLogger
  );
  featureDataBinding.init();
  gameServer.addDataBinding(featureDataBinding);

  const manaOceanSettingsLogger = createLogger('manaOceanSettingsDB');
  const manaOceanSettingsDB = new SettingsDataManager<ManaOceanSettingsData, ManaOceanSettingsProvider>(
    gameModel,
    new ManaOceanSettingsProvider(),
    'manaOcean',
    new PollingReadStrategy(gameModel, 15000, manaOceanSettingsLogger),
    defaultManaOceanSettings,
    manaOceanSettingsLogger,
  );
  manaOceanSettingsDB.init();
  gameServer.addDataBinding(manaOceanSettingsDB);

  const manaOceanEffectsSettingsLogger = createLogger('manaOceanEffectsSettingsDB');
  const manaOceanEffectsSettingsDB = new SettingsDataManager<ManaOceanEffectSettingsData, ManaOceanEffectSettingsProvider>(
    gameModel,
    new ManaOceanEffectSettingsProvider(),
    'manaOceanEffects',
    new PollingReadStrategy(gameModel, 15000, manaOceanEffectsSettingsLogger),
    manaOceanEffectSettings,
    manaOceanEffectsSettingsLogger,
  );
  manaOceanEffectsSettingsDB.init();
  gameServer.addDataBinding(manaOceanEffectsSettingsDB);

  const charLocDM = new CharacterLocDataManager(
    gameModel,
    createLogger('CharacterLocDataManager'),
  );
  charLocDM.init();
  gameServer.addDataBinding(charLocDM);

  gameServer.addDataBinding(new RedirectDataBinding2<EventBindingList>(
    gameModel,
    [
      {from: 'putCharHealthRequested', to: 'putCharHealthConfirmed'},
      {from: 'putCharLocationRequested', to: 'putCharLocationConfirmed'},
      {from: 'enableManaOceanRequested', to: 'enableManaOceanConfirmed'},
      {from: 'enableSpiritMovementRequested', to: 'enableSpiritMovementConfirmed'},
    ],
    createLogger('RedirectDataBinding2')
  ));
  gameServer.addDataBinding(new CharacterStatesListener(gameModel, createLogger('CharacterStatesListener')));
  gameServer.addDataBinding(new CharacterLocationListener(gameModel, createLogger('CharacterLocationListener')));
  gameServer.addDataBinding(new SpellCastsListener(gameModel, createLogger('SpellCastsListener')));
  const pushNotificationEmitter = new PushNotificationEmitter(gameModel, createLogger('PushNotificationEmitter'));
  pushNotificationEmitter.init();
  gameServer.addDataBinding(pushNotificationEmitter);
  gameServer.addDataBinding(new StubEventProcessor(
    gameModel, 
    createLogger('StubEventProcessor'), {
      emitEvents: [
        // event from client to set character location
        "emitCharacterLocationChanged",
        // mana ocean control events
        "addManaEffect",
        "removeManaEffect",
        "wipeManaOceanEffects",
        // used to forward character health states from server to client
        "setCharacterHealthStates",
        // event from client to manage spirits
        'postSpiritRequested',
        'putSpiritRequested',
        'deleteSpiritRequested',
        'cloneSpiritRequested',
        // temporary stubs for spirit fraction service
        'postSpiritFractionRequested',
        'putSpiritFractionRequested',
        'deleteSpiritFractionRequested',
        // event from client to manage spirit routes
        'postSpiritRouteRequested',
        'putSpiritRouteRequested',
        'deleteSpiritRouteRequested',
        'cloneSpiritRouteRequested',
        // not used on main server
        'setCatcherStates'
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}
