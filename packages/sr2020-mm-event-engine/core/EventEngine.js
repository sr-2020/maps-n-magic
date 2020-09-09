// eslint-disable-next-line max-classes-per-file
import { GameModel } from './GameModel';

function hardDispose(obj) {
  return Object.keys(obj).forEach((key) => { delete obj[key]; });
}

export class EventEngine {
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
