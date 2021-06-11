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
  // FeatureService, // features/abilities are not used now - temporary commented out
  
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

import { winstonLogger as rootLogger } from "./winstonLogger";

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
// import { FeatureProvider } from '../api/features';

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
  // FeatureService,
  // RescueServicePushService,
];

// eslint-disable-next-line max-lines-per-function
export function makeGameModel(): {
  gameModel: GameModel, gameServer: EventEngine
} {
  // const gameServer = new EventEngine(services, console);
  // @ts-ignore
  const gameServer = new EventEngine(services, rootLogger);
  // const gameServer = new EventEngine([], rootLogger);
  // gameServer.setData(database);
  const gameModel = gameServer.getGameModelImpl();
  // fillGameModelWithBots(gameModel);

  const beaconRecordLogger = rootLogger.customChild(rootLogger, { service: 'BeaconRecordDB' });
  const beaconRecordDataBinding = new CrudDataManager<BeaconRecord, BeaconRecordProvider>(
    gameModel,
    new BeaconRecordProvider(),
    'beaconRecord',
    new PollingReadStrategy(gameModel, 15000, beaconRecordLogger),
    beaconRecordLogger
  );
  beaconRecordDataBinding.init();
  gameServer.addDataBinding(beaconRecordDataBinding);

  const locationRecordDataBinding = new LocationDataManager<LocationRecord, LocationRecordProvider>(
    gameModel,
    new LocationRecordProvider(),
    'locationRecord',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  locationRecordDataBinding.init();
  gameServer.addDataBinding(locationRecordDataBinding);

  
  const spiritDataBinding = new CrudDataManagerPlus2<Spirit, SpiritProvider>(
    gameModel,
    new SpiritProvider(),
    'spirit',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  spiritDataBinding.init();
  gameServer.addDataBinding(spiritDataBinding);


  const spiritFractionDataBinding = new CrudDataManager2<SpiritFraction, SpiritFractionProvider>(
    gameModel,
    new SpiritFractionProvider(),
    'spiritFraction',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  spiritFractionDataBinding.init();
  gameServer.addDataBinding(spiritFractionDataBinding);

  const spiritRouteDataBinding = new CrudDataManager2<SpiritRoute, SpiritRouteProvider>(
    gameModel,
    new SpiritRouteProvider(),
    'spiritRoute',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  spiritRouteDataBinding.init();
  gameServer.addDataBinding(spiritRouteDataBinding);

  const userRecordDataBinding = new ReadDataManager<RawUserRecord, UserRecordProvider>(
    gameModel,
    new UserRecordProvider(),
    'userRecord',
    new PollingReadStrategy(gameModel, 15000, rootLogger, 'reloadUserRecords'),
    rootLogger
  );
  userRecordDataBinding.init();
  gameServer.addDataBinding(userRecordDataBinding);

  // const featureDataBinding = new ReadDataManager2<Feature, FeatureProvider>(
  //   gameModel,
  //   new FeatureProvider(),
  //   'feature',
  //   new PollingReadStrategy(gameModel, 60 * 60 * 1000, rootLogger), // 1 hour
  //   rootLogger
  // );
  // featureDataBinding.init();
  // gameServer.addDataBinding(featureDataBinding);

  const manaOceanSettingsDB = new SettingsDataManager<ManaOceanSettingsData, ManaOceanSettingsProvider>(
    gameModel,
    new ManaOceanSettingsProvider(),
    'manaOcean',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    defaultManaOceanSettings,
    rootLogger,
  );
  manaOceanSettingsDB.init();
  gameServer.addDataBinding(manaOceanSettingsDB);

  const manaOceanEffectsSettingsDB = new SettingsDataManager<ManaOceanEffectSettingsData, ManaOceanEffectSettingsProvider>(
    gameModel,
    new ManaOceanEffectSettingsProvider(),
    'manaOceanEffects',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    manaOceanEffectSettings,
    rootLogger,
  );
  manaOceanEffectsSettingsDB.init();
  gameServer.addDataBinding(manaOceanEffectsSettingsDB);

  const charLocDM = new CharacterLocDataManager(
    gameModel,
    rootLogger,
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
    rootLogger
  ));
  gameServer.addDataBinding(new CharacterStatesListener(gameModel, rootLogger));
  gameServer.addDataBinding(new CharacterLocationListener(gameModel, rootLogger));
  gameServer.addDataBinding(new SpellCastsListener(gameModel, rootLogger));
  const pushNotificationEmitter = new PushNotificationEmitter(gameModel, rootLogger);
  pushNotificationEmitter.init();
  gameServer.addDataBinding(pushNotificationEmitter);
  gameServer.addDataBinding(new StubEventProcessor(
    gameModel, 
    rootLogger, {
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
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}
