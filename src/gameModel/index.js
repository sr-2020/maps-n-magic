import { GameModel } from './core/GameModel';
import { Migrator } from './Migrator';

import { services } from './GameModelServices';

import { fillGameModelWithBots } from './GameModelFiller';
import { CrudDataManager } from './dataManagers/CrudDataManager';
import { ReadDataManager } from './dataManagers/ReadDataManager';
import { SingleReadStrategy } from './dataManagers/SingleReadStrategy';
import { PollingReadStrategy } from './dataManagers/PollingReadStrategy';

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
