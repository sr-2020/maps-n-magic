import { GameModel } from './core/GameModel';
import { Migrator } from './Migrator';

import { services } from './GameModelServices';

import { fillGameModelWithBots } from './GameModelFiller';
import { CrudDataManager } from './dataManagers/CrudDataManager';
import { ReadDataManager } from './dataManagers/ReadDataManager';
import { SingleReadStrategy } from './dataManagers/SingleReadStrategy';
import { PollingReadStrategy } from './dataManagers/PollingReadStrategy';

export function makeGameModel(database) {
  const gameModel = new GameModel();
  gameModel.init(services, Migrator);
  gameModel.setData(database);
  fillGameModelWithBots(gameModel);
  return { gameModel };
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
