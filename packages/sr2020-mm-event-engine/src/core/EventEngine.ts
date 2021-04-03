// eslint-disable-next-line max-classes-per-file
import { GameModel } from './GameModel';

import { GMLogger } from "./types";
import { getChildLogger } from "./utils";
import { AbstractService } from "./AbstractService";
import { AbstractDataBinding } from "./AbstractDataBinding";

// function hardDispose(obj: Record<string | number | symbol, unknown>) {
//   return Object.keys(obj).forEach((key) => { delete obj[key]; });
// }

export class EventEngine {
  gameModel: GameModel;

  dataBindings: AbstractDataBinding[];

  constructor(services2: typeof AbstractService[], logger: GMLogger) {
    this.gameModel = new GameModel(getChildLogger(logger, {service: 'GameModel'}));
    this.gameModel.init(services2);
    this.dataBindings = [];
  }

  dispose(): void {
    this.gameModel.dispose();
    // hardDispose(this.gameModel);
    this.dataBindings.forEach((el) => el.dispose());
  }

  getGameModel(): GameModel {
    return this.gameModel;
  }

  // setData(database) {
  //   this.gameModel.setData(database);
  // }

  addDataBinding(dataBinding: AbstractDataBinding) {
    this.dataBindings.push(dataBinding);
  }
}
