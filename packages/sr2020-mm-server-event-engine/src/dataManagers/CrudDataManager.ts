import * as R from 'ramda';

import { GameModel, Identifiable, GMLogger } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import { ReadDataManager } from './ReadDataManager';

import {
  ManageablePlusResourceProvider,
  ManageableResourceProvider
} from '../api/position';

export class CrudDataManager<
  Entity extends Identifiable, 
  T extends ManageableResourceProvider<Entity>
> extends ReadDataManager<Entity, T> {
  putEntityTimeoutIndex: {[key: number]: NodeJS.Timeout};

  constructor(
    gameModel: GameModel, 
    dataProvider: T, 
    entityName: string, 
    readStrategy: ReadStrategy,
    logger: GMLogger, 
  ) {
    super(gameModel, dataProvider, entityName, readStrategy, logger);
    this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntityRequested = this.onPutEntityRequested.bind(this);
    this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
    this.putEntityTimeoutIndex = {};
  }

  init() {
    super.init();
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    super.dispose();
    this.subscribe('off', this.gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel): void {
    gameModel[action](`post${this.ccEntityName}Requested`, this.onPostEntityRequested);
    gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
    gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  onPostEntityRequested({ props }: {props: Entity}) {
    this.logger.debug(`Post requested, entity: ${this.entityName}`);
    this.dataProvider.post({ props }).then((entity) => {
      this.logger.debug(`Post confirmed, entity: ${this.entityName}, id ${entity.id}`);
      // @ts-ignore
      this.entities.push(entity);
      this.gameModel.execute({
        type: `post${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  }

  onPutEntityRequested({ id, props}:{id: number, props: Entity}) {
    this.logger.debug(`Put requested, entity: ${this.entityName}, id ${id}`);
    clearTimeout(this.putEntityTimeoutIndex[id]);

    this.putEntityTimeoutIndex[id] = setTimeout(() => {
      this.dataProvider.put({ id, props }).then((entity: unknown) => {
        this.logger.debug(`Put confirmed, entity: ${this.entityName}, id ${id}`);
        const index = this.entities.findIndex((br) => br.id === id);
        // @ts-ignore
        this.entities[index] = entity;
        this.gameModel.execute({
          type: `put${this.ccEntityName}Confirmed`,
          [this.entityName]: entity,
        });
      }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
    }, 500);
  }

  onDeleteEntityRequested({ id }: { id: number }) {
    this.logger.debug(`Delete requested, entity: ${this.entityName}, id ${id}`);
    this.dataProvider.delete({ id }).then(() => {
      this.logger.debug(`Delete confirmed, entity: ${this.entityName}, id ${id}`);
      const entity = this.entities.find((br) => br.id === id);
      this.entities = this.entities.filter((br) => br.id !== id);
      this.gameModel.execute({
        type: `delete${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  }
}
