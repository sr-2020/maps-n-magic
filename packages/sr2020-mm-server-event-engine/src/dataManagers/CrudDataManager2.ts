import * as R from 'ramda';

import { GameModel, Identifiable, GMLogger } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import { ReadDataManager2 } from './ReadDataManager2';

import {
  ManageableResourceProvider
} from '../api/position';

import { Manageable2 } from "../api/types";

export class CrudDataManager2<
  Entity extends Identifiable, 
  T extends Manageable2<Entity>
> extends ReadDataManager2<Entity, T> {
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
    const metadata = this.getMetadata();
    this.setMetadata({
      emitEvents: [
        ...metadata.emitEvents,
        `post${this.ccEntityName}Confirmed`,
        `put${this.ccEntityName}Confirmed`,
        `delete${this.ccEntityName}Confirmed`
      ],
      listenEvents: [
        ...metadata.listenEvents,
        `post${this.ccEntityName}Requested`,
        `put${this.ccEntityName}Requested`,
        `delete${this.ccEntityName}Requested`
      ],
    });
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

  onPostEntityRequested({props}: {props: Partial<Omit<Entity, "id">>}): void {
    this.logger.debug(`Post requested, entity: ${this.entityName}`);
    this.dataProvider.post(props).then((entity) => {
      this.logger.debug(`Post confirmed, entity: ${this.entityName}, id ${entity.id}`);
      this.entities.push(entity);
      this.gameModel.emit2({
        type: `post${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  }

  onPutEntityRequested({ id, props }: {id: number, props: Partial<Omit<Entity, "id">>}): void {
    const index = this.entities.findIndex((br) => br.id === id);
    if (index === -1) {
      this.logger.warn(`Put entity not exists: id ${id}`);
      return;
    }
    const entity = {...this.entities[index], ...props};
    this.logger.debug(`Put requested, entity: ${this.entityName}, id ${id}`);
    clearTimeout(this.putEntityTimeoutIndex[id]);
    this.putEntityTimeoutIndex[id] = setTimeout(() => {
      this.dataProvider.put(entity).then((entity: Entity) => {
        this.logger.debug(`Put confirmed, entity: ${this.entityName}, id ${id}`);
        const index = this.entities.findIndex((br) => br.id === id);
        this.entities[index] = entity;
        this.gameModel.emit2({
          type: `put${this.ccEntityName}Confirmed`,
          [this.entityName]: entity,
        });
      }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
    }, 500);
  }

  onDeleteEntityRequested({ id }: { id: number }): void {
    this.logger.debug(`Delete requested, entity: ${this.entityName}, id ${id}`);
    this.dataProvider.delete(id).then(() => {
      this.logger.debug(`Delete confirmed, entity: ${this.entityName}, id ${id}`);
      const entity = this.entities.find((br) => br.id === id);
      this.entities = this.entities.filter((br) => br.id !== id);
      this.gameModel.emit2({
        type: `delete${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  }
}
