import { 
  EventEngine,
  LocationRecordService,
  BeaconRecordService,
  // NotificationService,
  CharacterHealthStateService,
  UserRecordService,
  SettingsService,
  ManaOceanEnableService,
  AbstractService,
  BeaconRecord,
  LocationRecord,
  UserRecord,
  ManaOceanSettingsData,
  ManaOceanEffectSettingsData,
  StubEventProcessor,
  // redirect events
  EPutCharHealthRequested,
  EPutCharHealthConfirmed,
  EPutCharLocationRequested,
  EPutCharLocationConfirmed,
  EEnableManaOceanRequested,
  EEnableManaOceanConfirmed,
  GameModel,
  Spirit,
} from 'sr2020-mm-event-engine';

import { ManaOceanService } from '../services/ManaOceanService';
import { MassacreService } from '../services/MassacreService';
import { PushNotificationService } from '../services/PushNotificationService';
import { AudioStageService } from '../services/AudioStageService';
import { CharacterLocationService } from '../services/CharacterLocationService';
// Push notifications delivery was unstable so decided to disable this feature
// if we don't have better solution.
// For details see https://trello.com/c/giDbdVGa/628-фантомные-кс-пуши-в-уведомлении
// import { RescueServicePushService } from '../services/RescueServicePushService';

import { CrudDataManager } from '../dataManagers/CrudDataManager';
import { LocationDataManager } from '../dataManagers/LocationDataManager';
import { ReadDataManager } from '../dataManagers/ReadDataManager';
import { ReadDataManager2 } from '../dataManagers/ReadDataManager2';
import { CrudDataManager2 } from '../dataManagers/CrudDataManager2';
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
import { SpiritProvider } from '../api/spirits';

type EventBindingList = 
  StrictEventBinding<EPutCharHealthRequested, EPutCharHealthConfirmed> |
  StrictEventBinding<EPutCharLocationRequested, EPutCharLocationConfirmed> |
  StrictEventBinding<EEnableManaOceanRequested, EEnableManaOceanConfirmed>
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
  MassacreService,
  PushNotificationService,
  AudioStageService,
  CharacterLocationService,
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

  

  // const spiritDataBinding = new ReadDataManager2<Spirit, SpiritProvider>(
  const spiritDataBinding = new CrudDataManager2<Spirit, SpiritProvider>(
    gameModel,
    new SpiritProvider(),
    'spirit',
    new PollingReadStrategy(gameModel, 15000, rootLogger),
    rootLogger
  );
  spiritDataBinding.init();
  gameServer.addDataBinding(spiritDataBinding);


  const userRecordDataBinding = new ReadDataManager<UserRecord, UserRecordProvider>(
    gameModel,
    new UserRecordProvider(),
    'userRecord',
    new PollingReadStrategy(gameModel, 15000, rootLogger, 'reloadUserRecords'),
    rootLogger
  );
  userRecordDataBinding.init();
  gameServer.addDataBinding(userRecordDataBinding);

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
        // temporary stubs for spirit service
        'postSpiritRequested',
        'putSpiritRequested',
        'deleteSpiritRequested',
      ]
    }
  ));

  gameModel.verifyEvents();
  gameModel.finishVerification();

  return { gameModel, gameServer };
}
