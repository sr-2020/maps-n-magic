// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { GameModel, GMLogger, EPostNotification, AbstractEventProcessor } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import {
  ManageablePlusResourceProvider,
  ManageableResourceProvider,
  GettableResourceProvider
} from '../api/position';

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ReadDataManager2<Entity, T extends GettableResourceProvider<Entity>> extends AbstractEventProcessor {
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
  }

  init() {
    this.readStrategy.init(this);
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.readStrategy.dispose();
  }

  async load() {
    this.logger.info(`Call to load ${this.entityName}`);
    // console.log(`load ${this.entityName}`);
    try {
      const entities = await this.dataProvider.get();
      if (R.equals(this.entities, entities)) {
        // console.log('no changes', this.ccEntityName);
        return;
      }
      this.entities = entities;
      // console.log(entities);
      this.gameModel.execute({
        type: `set${this.ccEntityName}s`,
        [this.plural]: R.clone(this.entities),
      });
    } catch(err) {
      this.getErrorHandler(`Error on ${this.entityName} loading`)(err);
    }
  }

  getErrorHandler(title: string) {
    return (err: Error) => {
      console.error(err);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title,
        message: err?.message || String(err),
        kind: 'error',
      });
    };
  }
}
