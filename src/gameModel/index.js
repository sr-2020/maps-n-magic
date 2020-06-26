// eslint-disable-next-line max-classes-per-file
import { GameModel } from './core/GameModel';
import { Migrator } from './Migrator';

import { services } from './GameModelServices';

import { fillGameModelWithBots } from './GameModelFiller';
import { CrudDataManager } from './dataManagers/CrudDataManager';
import { ReadDataManager } from './dataManagers/ReadDataManager';
import { ReadWriteDataManager } from './dataManagers/ReadWriteDataManager';
import { SingleReadStrategy } from './dataManagers/SingleReadStrategy';
import { PollingReadStrategy } from './dataManagers/PollingReadStrategy';

import {
  RemoteLocationRecordProvider as LocationRecordProvider,
  RemoteBeaconRecordProvider as BeaconRecordProvider,
  RemoteUsersRecordProvider as UserRecordProvider,
  ManaOceanSettingsProvider,
} from './api/position';

import { hardDispose } from '../utils/miscUtils';

class DataBinding {
  constructor({
    gameModel, entityName, DataProvider, DataManager, ReadStrategy, ReadStrategyArgs = [],
  }) {
    this.dataManager = new DataManager(
      gameModel,
      new DataProvider(),
      entityName,
      new ReadStrategy(gameModel, ...ReadStrategyArgs),
    );
    this.dataManager.initialize();
  }

  dispose() {
    this.dataManager.dispose();
  }
}

export class GameServer {
  constructor(services2, Migrator2) {
    this.gameModel = new GameModel();
    this.gameModel.init(services2, Migrator2);
    this.dataBindings = [];
  }

  dispose() {
    this.gameModel.dispose();
    hardDispose(this.gameModel);
    this.dataBindings.forEach((el) => el.dispose());
  }

  getGameModel() {
    return this.gameModel;
  }

  setData(database) {
    this.gameModel.setData(database);
  }

  addDataBinding(dataBinding) {
    this.dataBindings.push(dataBinding);
  }
}

export function makeGameModel(database) {
  const gameServer = new GameServer(services, Migrator);
  gameServer.setData(database);
  const gameModel = gameServer.getGameModel();
  fillGameModelWithBots(gameModel);

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
    DataProvider: LocationRecordProvider,
    DataManager: CrudDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
  }));
  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'userRecord',
    DataProvider: UserRecordProvider,
    DataManager: ReadDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000, 'reloadUserRecords'],
  }));
  gameServer.addDataBinding(new DataBinding({
    gameModel,
    entityName: 'manaOceanSetting',
    DataProvider: ManaOceanSettingsProvider,
    DataManager: ReadWriteDataManager,
    ReadStrategy: PollingReadStrategy,
    ReadStrategyArgs: [15000],
  }));
  return { gameModel, gameServer };
}

export {
  GameModel,
  Migrator,
  services,
  fillGameModelWithBots,
  ReadDataManager,
  CrudDataManager,
  SingleReadStrategy,
  PollingReadStrategy,
};
