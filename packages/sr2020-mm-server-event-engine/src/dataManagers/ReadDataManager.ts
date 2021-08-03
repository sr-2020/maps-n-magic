// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { GameModel, GMLogger, EPostNotification, AbstractEventProcessor } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import {
  ManageablePlusResourceProvider,
  ManageableResourceProvider,
  GettableResourceProvider
} from '../api/position';

import { Gettable } from "../api/types";

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ReadDataManager<Entity, T extends Gettable<Entity>> extends AbstractEventProcessor {
  entities: Entity[];

  plural: string;

  ccEntityName: string;

  constructor(
    protected gameModel: GameModel, 
    protected dataProvider: T, 
    protected entityName: string, 
    private readStrategy: ReadStrategy,
    protected logger: GMLogger, 
  ) {
    super(gameModel, logger);
    this.entities = [];
    this.entityName = entityName;
    this.plural = `${entityName}s`;
    this.ccEntityName = capitalizeFirstLetter(entityName);
    this.setMetadata({
      emitEvents: ['postNotification']
    });
  }

  init() {
    this.readStrategy.init(this);
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.readStrategy.dispose();
  }

  load() {
    // this.logger.info(`Call to load ${this.entityName}`);
    this.dataProvider.get().then((entities) => {
      if (R.equals(this.entities, entities)) {
        // this.logger.info('no changes', this.ccEntityName);
        return;
      }
      this.entities = entities;
      // this.logger.info(entities);
      this.gameModel.execute({
        type: `set${this.ccEntityName}s`,
        [this.plural]: R.clone(this.entities),
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} loading`));
  }

  getErrorHandler(title: string) {
    return (err: Error) => {
      this.logger.error(err);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title,
        message: err.message || String(err),
        kind: 'error',
      });
    };
  }
}
