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
import { ManaOceanSettingsService } from '../../services/ManaOceanSettingsService';
import { ManaOceanService } from '../../services/ManaOceanService';
import { ManaOceanEnableService } from '../../services/ManaOceanEnableService';

// // import { fillGameModelWithBots } from './GameModelFiller';
import { CrudDataManager } from '../../dataManagers/CrudDataManager';
import { LocationDataManager } from '../../dataManagers/LocationDataManager';
// import { ReadDataManager } from '../../dataManagers/ReadDataManager';
import { ReadWriteSettingsDataManager } from '../../dataManagers/SettingsDataManagers';
// import { SingleReadStrategy } from '../../dataManagers/SingleReadStrategy';
import { PollingReadStrategy } from '../../dataManagers/PollingReadStrategy';
import { DataBinding } from '../../dataManagers/DataBinding';
import { RedirectDataBinding } from '../../dataManagers/RedirectDataBinding';

import {
  RemoteLocationRecordProvider as LocationRecordProvider,
  RemoteBeaconRecordProvider as BeaconRecordProvider,
  RemoteUsersRecordProvider as UserRecordProvider,
  ManaOceanSettingsProvider,
} from '../../api/position';

import { CharacterStatesListener } from '../../api/characterStates/CharacterStatesListener';

import { EventEngine } from '../../core/EventEngine';

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
  ManaOceanSettingsService,
  ManaOceanService,
  ManaOceanEnableService,
];

export function makeGameModel(database) {
  const gameServer = new EventEngine(services);
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
    entityName: 'manaOceanSettings',
    DataProvider: ManaOceanSettingsProvider,
    DataManager: ReadWriteSettingsDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
  }));
  gameServer.addDataBinding(new RedirectDataBinding(
    gameModel,
    {
      putCharHealthRequested: 'putCharHealthConfirmed',
      enableManaOceanRequested: 'enableManaOceanConfirmed',
    },
  ));
  const characterStatesListener = new CharacterStatesListener(gameModel);
  return { gameModel, gameServer };
}
