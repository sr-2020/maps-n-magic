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
  SpiritPhraseService,
  PlayerMessagesService,
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
  SpiritPhrase,
  PlayerMessage,
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
// import { MockedCrudDataManager } from '../dataManagers/MockedCrudDataManager';
import { LocationDataManager } from '../dataManagers/LocationDataManager';
import { ReadDataManager } from '../dataManagers/ReadDataManager';
// import { MockedReadDataManager } from '../dataManagers/MockedReadDataManager';
import { ReadDataManager2 } from '../dataManagers/ReadDataManager2';
import { CrudDataManager2, CrudDataManagerPlus2, PutEntityArg } from '../dataManagers/CrudDataManager2';
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
  MockedUsersRecordProvider,
  MockedBeaconRecordProvider,
  MockedLocationRecordProvider,
  ManageablePlusResourceProvider,
  ManageableResourceProvider
} from '../api/position';

import {  
  ManaOceanSettingsProvider,
  ManaOceanEffectSettingsProvider,
  SettingsResourceProvider,
} from "../api/settings";

import { CharacterStatesListener } from '../api/characterStates/CharacterStatesListener';
import { CharacterLocationListener } from '../api/position/CharacterLocationListener';
import { SpellCastsListener } from '../api/spellCasts/SpellCastsListener';
import { PushNotificationEmitter } from '../api/pushNotificationEmitter';
import { 
  SpiritProvider, 
  SpiritFractionProvider, 
  SpiritRouteProvider,
  SpiritPhraseProvider,
  PlayerMessageProvider,
  MockedPlayerMessageProvider,
  MockedFeatureProvider
} from '../api/spirits';
import { createLogger } from '../utils';
import { FeatureProvider } from '../api/features';
import { ModelManagetLocInitializer } from '../services/ModelManagetLocInitializer';
import { PutSpiritRequestedCall } from '../types';
import { Gettable, Gettable2, Manageable2, ManageablePlus2, SingleGettable2 } from '../api/types';

type EventBindingList = 
  | StrictEventBinding<EPutCharHealthRequested, EPutCharHealthConfirmed>
  | StrictEventBinding<EPutCharLocationRequested, EPutCharLocationConfirmed>
  | StrictEventBinding<EEnableManaOceanRequested, EEnableManaOceanConfirmed>
  | StrictEventBinding<EEnableSpiritMovementRequested, EEnableSpiritMovementConfirmed>
;

const mocked = false;
// const mocked = true;

const services = [
  // positioning and emercom
  LocationRecordService,
  BeaconRecordService,
  CharacterHealthStateService,
  UserRecordService,
  CharacterLocationService,

  // mana ocean
  ManaOceanService,
  ManaOceanEnableService,
  MassacreService,
  // this service is generic in theory but there is 
  // only mana ocean specific settings
  SettingsService, 

  // spirits
  SpiritService,
  SpiritFractionService,
  SpiritRouteService,
  SpiritMovementService,
  SpiritMovementEnableService,
  SpiritCatcherService,
  SpiritCatcherUpdateService,
  SpiritPhraseService,
  PlayerMessagesService,

  // all features getter - abilities, spells, archetypes and other
  FeatureService,
  // push notification sender
  PushNotificationService,
  // auxilary service to init locations in model-engine (external server)
  ModelManagetLocInitializer,

  // don't remember service purpose
  // AudioStageService,
  // RescueServicePushService,
  // NotificationService,
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
  const beaconRecordDataBinding = new CrudDataManager<BeaconRecord, ManageableResourceProvider<BeaconRecord>>(
    gameModel,
    mocked ? new MockedBeaconRecordProvider() : new BeaconRecordProvider(),
    'beaconRecord',
    new PollingReadStrategy(gameModel, 15000, beaconRecordLogger),
    beaconRecordLogger
  );
  beaconRecordDataBinding.init();
  gameServer.addDataBinding(beaconRecordDataBinding);

  const locationRecordLogger = createLogger('locationRecordDataBinding');
  const locationRecordDataBinding = new LocationDataManager<LocationRecord, ManageablePlusResourceProvider<LocationRecord>>(
    gameModel,
    mocked ? new MockedLocationRecordProvider() : new LocationRecordProvider(),
    'locationRecord',
    new PollingReadStrategy(gameModel, 15000, locationRecordLogger),
    locationRecordLogger
  );
  locationRecordDataBinding.init();
  gameServer.addDataBinding(locationRecordDataBinding);

  const spiritLogger = createLogger('spiritDataBinding');
  const spiritDataBinding = new CrudDataManagerPlus2<Spirit, ManageablePlus2<Spirit>>(
    gameModel,
    new SpiritProvider(),
    'spirit',
    new PollingReadStrategy(gameModel, 15000, spiritLogger),
    spiritLogger
  );
  spiritDataBinding.init();
  gameServer.addDataBinding(spiritDataBinding);

  (gameModel as unknown as PutSpiritRequestedCall).putSpiritRequested = ({ id, props }: PutEntityArg<Spirit>): Promise<Spirit | null> => {
    return spiritDataBinding.onPutEntityRequested({ id, props });
  }

  const spiritFractionLogger = createLogger('spiritFractionDataBinding');
  const spiritFractionDataBinding = new CrudDataManager2<SpiritFraction, Manageable2<SpiritFraction>>(
    gameModel,
    new SpiritFractionProvider(),
    'spiritFraction',
    new PollingReadStrategy(gameModel, 15000, spiritFractionLogger),
    spiritFractionLogger
  );
  spiritFractionDataBinding.init();
  gameServer.addDataBinding(spiritFractionDataBinding);

  const spiritRouteLogger = createLogger('spiritRouteDataBinding');
  const spiritRouteDataBinding = new CrudDataManager2<SpiritRoute, Manageable2<SpiritRoute>>(
    gameModel,
    new SpiritRouteProvider(),
    'spiritRoute',
    new PollingReadStrategy(gameModel, 15000, spiritRouteLogger),
    spiritRouteLogger
  );
  spiritRouteDataBinding.init();
  gameServer.addDataBinding(spiritRouteDataBinding);

  const spiritPhraseLogger = createLogger('spiritPhraseDataBinding');
  const spiritPhraseDataBinding = new CrudDataManager2<SpiritPhrase, Manageable2<SpiritPhrase>>(
    gameModel,
    new SpiritPhraseProvider(),
    'spiritPhrase',
    new PollingReadStrategy(gameModel, 15000, spiritPhraseLogger),
    spiritPhraseLogger
  );
  spiritPhraseDataBinding.init();
  gameServer.addDataBinding(spiritPhraseDataBinding);

  const userRecordLogger = createLogger('userRecordDataBinding');
  const userRecordDataBinding = new ReadDataManager<RawUserRecord, Gettable<RawUserRecord>>(
    gameModel,
    mocked ? new MockedUsersRecordProvider() : new UserRecordProvider(),
    'userRecord',
    new PollingReadStrategy(gameModel, 15000, userRecordLogger, 'reloadUserRecords'),
    userRecordLogger
  );
  userRecordDataBinding.init();
  gameServer.addDataBinding(userRecordDataBinding);

  const featureLogger = createLogger('featureDataBinding');
  const featureDataBinding = new ReadDataManager2<Feature, Gettable2<Feature> & SingleGettable2<Feature>>(
    gameModel,
    mocked ? new MockedFeatureProvider() : new FeatureProvider(),
    'feature',
    new PollingReadStrategy(gameModel, 60 * 60 * 1000, featureLogger), // 1 hour
    featureLogger
  );
  featureDataBinding.init();
  gameServer.addDataBinding(featureDataBinding);

  const playerMessageLogger = createLogger('playerMessagesDataBinding');
  const playerMessageDataBinding = new ReadDataManager2<PlayerMessage, Gettable2<PlayerMessage> & SingleGettable2<PlayerMessage>>(
    gameModel,
    mocked ? new MockedPlayerMessageProvider() : new PlayerMessageProvider(),
    'playerMessage',
    new PollingReadStrategy(gameModel, 15000, playerMessageLogger), // 1 minute
    playerMessageLogger
  );
  playerMessageDataBinding.init();
  gameServer.addDataBinding(playerMessageDataBinding);

  const manaOceanSettingsLogger = createLogger('manaOceanSettingsDB');
  const manaOceanSettingsDB = new SettingsDataManager<ManaOceanSettingsData, SettingsResourceProvider<ManaOceanSettingsData>>(
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
  const manaOceanEffectsSettingsDB = new SettingsDataManager<ManaOceanEffectSettingsData, SettingsResourceProvider<ManaOceanEffectSettingsData>>(
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
        // event from client to manage spirit phrases
        'putSpiritPhraseRequested',
        'deleteSpiritPhraseRequested',
        // not used on main server
        'setCatcherStates'
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}
