// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { GameModel } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import {
  ManageablePlusResourceProvider,
  ManageableResourceProvider,
  GettableResourceProvider
} from '../api/position';

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ReadDataManager<Entity, T extends GettableResourceProvider<Entity>> {
  entities: Entity[];

  plural: string;

  ccEntityName: string;

  constructor(
    protected gameModel: GameModel, 
    protected dataProvider: T, 
    protected entityName: string, 
    private readStrategy: ReadStrategy
  ) {
    this.entities = [];
    this.entityName = entityName;
    this.plural = `${entityName}s`;
    this.ccEntityName = capitalizeFirstLetter(entityName);
  }

  initialize() {
    this.readStrategy.initialize(this);
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.readStrategy.dispose();
  }

  load() {
    // console.log(`load ${this.entityName}`);
    this.dataProvider.get().then((entities) => {
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
    }).catch(this.getErrorHandler(`Error on ${this.entityName} loading`));
  }

  getErrorHandler(title: string) {
    return (err: {message?: unknown}) => {
      console.error(err);
      this.gameModel.execute({
        type: 'postNotification',
        title,
        message: err.message || err,
        kind: 'error',
      });
    };
  }
}
