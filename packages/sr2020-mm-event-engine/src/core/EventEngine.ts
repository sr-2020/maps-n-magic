// eslint-disable-next-line max-classes-per-file
import { GameModel, GameModelImpl } from './GameModel';

import { GMLogger } from "./types";
import { getChildLogger } from "./utils";
import { AbstractService } from "./AbstractService";
import { AbstractDataBinding } from "./AbstractDataBinding";
import { AbstractEventProcessor } from "./AbstractEventProcessor";

// function hardDispose(obj: Record<string | number | symbol, unknown>) {
//   return Object.keys(obj).forEach((key) => { delete obj[key]; });
// }

export class EventEngine {
  gameModel: GameModelImpl;

  dataBindings: AbstractDataBinding[];

  constructor(services2: typeof AbstractService[], logger: GMLogger) {
    // 
    this.gameModel = new GameModelImpl(getChildLogger(logger, {service: 'GameModel'}));
    // this.gameModel.init(services2);

    services2.forEach((serviceClass) => {
      // this.logger.info('Creating service', service.constructor.name);
      logger.info('Creating service', serviceClass.name);
      const childLogger = getChildLogger(logger, { service: serviceClass.name });
      const service = new serviceClass(this.gameModel, childLogger);
      // const service: AbstractService = new ServiceClass(childLogger);
      // service.init(this, childLogger);
      service.init();
      this.gameModel.registerService(service);
      // return service;
    });

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

  getGameModelImpl(): GameModelImpl {
    return this.gameModel;
  }

  // setData(database) {
  //   this.gameModel.setData(database);
  // }

  addDataBinding(dataBinding: AbstractEventProcessor) {
    // this.dataBindings.push(dataBinding);
    this.gameModel.registerEventProcessor(dataBinding);
  }
}
