// eslint-disable-next-line max-classes-per-file
import { GameModel } from './GameModel';

function hardDispose(obj) {
  return Object.keys(obj).forEach((key) => { delete obj[key]; });
}

export class EventEngine {
  gameModel: GameModel;

  dataBindings: any;

  constructor(services2, logger, Migrator2) {
    this.gameModel = new GameModel(logger);
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
