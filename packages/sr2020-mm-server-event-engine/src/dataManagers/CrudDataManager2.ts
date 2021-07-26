import * as R from 'ramda';

import { GameModel, Identifiable, GMLogger } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import { ReadDataManager2 } from './ReadDataManager2';

import {
  ManageableResourceProvider
} from '../api/position';

import { Manageable2, ManageablePlus2 } from "../api/types";

export type EntityProps<Entity> = Partial<Omit<Entity, "id">>;

export type PutEntityArg<Entity> = {id: number, props: EntityProps<Entity>};

export class CrudDataManager2<
  Entity extends Identifiable, 
  T extends Manageable2<Entity>
> extends ReadDataManager2<Entity, T> {
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

  onPostEntityRequested({props}: {props: EntityProps<Entity>}): void {
    const noIdEntity = this.dataProvider.fillNewEntity(props);
    if (!this.dataProvider.validateNewEntity(noIdEntity)) {
      throw new Error("Post entity is not valid " + 
        JSON.stringify(noIdEntity) + ", " + 
        JSON.stringify(this.dataProvider.validateNewEntity.errors)
      );
    }
    this.logger.debug(`Post requested, entity: ${this.entityName}`);
    this.dataProvider.post(noIdEntity).then((entity) => {
      this.logger.debug(`Post confirmed, entity: ${this.entityName}, id ${entity.id}`);
      this.entities.push(entity);
      this.gameModel.emit2({
        type: `post${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  }


  // put entity should not be deferred
  // It is better to defer gameModel events emitting (mostly UI code).
  async onPutEntityRequested({ id, props }: PutEntityArg<Entity>): Promise<null | Entity> {
    // this.logger.info('onPutEntityRequested', this.entityName, id);
    const index = this.entities.findIndex((br) => br.id === id);
    if (index === -1) {
      this.logger.warn(`Put entity not exists: id ${id}`);
      return Promise.resolve(null);
    }
    // this.dataProvider.
    const dbEntity = await this.dataProvider.singleGet(id) as Entity;
    // const entity = {...this.entities[index], ...props};
    const entity = {...dbEntity, ...props};
    if (!this.dataProvider.validateEntity(entity)) {
      throw new Error("Put entity is not valid " + 
        JSON.stringify(entity) + ", " + 
        JSON.stringify(this.dataProvider.validateEntity.errors)
      );
    }


    this.logger.debug(`Put requested, entity: ${this.entityName}, id ${id}`);
    return this.dataProvider.put(entity).then((entity: Entity) => {
      this.logger.debug(`Put confirmed, entity: ${this.entityName}, id ${id}`);
      this.entities[index] = entity;
      this.gameModel.emit2({
        type: `put${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
      return entity;
    }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
  }

  onDeleteEntityRequested({ id }: { id: number }): void {
    this.logger.debug(`Delete requested, entity: ${this.entityName}, id ${id}`);
    const entity = this.entities.find((br) => br.id === id);
    this.entities = this.entities.filter((br) => br.id !== id);
    this.gameModel.emit2({
      type: `delete${this.ccEntityName}Confirmed`,
      [this.entityName]: entity,
    });
    this.dataProvider.delete(id).then(() => {
      this.logger.debug(`Delete confirmed, entity: ${this.entityName}, id ${id}`);
    }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  }
}

export class CrudDataManagerPlus2<
  Entity extends Identifiable, 
  T extends ManageablePlus2<Entity>
> extends CrudDataManager2<Entity, T> {

  constructor(
    gameModel: GameModel, 
    dataProvider: T, 
    entityName: string, 
    readStrategy: ReadStrategy,
    logger: GMLogger, 
  ) {
    super(gameModel, dataProvider, entityName, readStrategy, logger);
    this.onPutEntitiesRequested = this.onPutEntitiesRequested.bind(this);
    const metadata = this.getMetadata();
    this.setMetadata({
      emitEvents: [
        ...metadata.emitEvents,
        `put${this.ccPlural}Confirmed`,
      ],
      listenEvents: [
        ...metadata.listenEvents,
        `put${this.ccPlural}Requested`,
      ],
    });
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel): void {
    super.subscribe(action, gameModel);
    gameModel[action](`put${this.ccPlural}Requested`, this.onPutEntitiesRequested);
  }
  
  onPutEntitiesRequested({ updates }: { updates: PutEntityArg<Entity>[]; }): void {
    // this.logger.info('onPutEntitiesRequested');
    // @ts-ignore
    const entityIndex = R.indexBy<Entity, Identifiable["id"]>(R.prop('id'), this.entities);
    // this.logger.info('entityIndex', entityIndex);
    const updatedEntities = updates.reduce((acc: Entity[], update) => {
      if (entityIndex[update.id] === undefined){
        this.logger.warn(`Put entity not exists: id ${update.id}`);
        return acc;
      }
      const entity = {...entityIndex[update.id], ...update.props};
      if (!this.dataProvider.validateEntity(entity)) {
        throw new Error("Put entity is not valid " + 
          JSON.stringify(entity) + ", " + 
          JSON.stringify(this.dataProvider.validateEntity.errors)
        );
      }
      entityIndex[update.id] = entity;
      acc.push(entity);
      return acc;
    }, []);

    // this.logger.info('after entityIndex', Object.values(entityIndex));
    this.entities = Object.values(entityIndex);
    this.gameModel.emit2({
      type: `put${this.ccPlural}Confirmed`,
      [`${this.entityName}s`]: updatedEntities,
    });

    this.dataProvider.putMultiple(updatedEntities).then((entities: Entity[]) => {
      this.logger.debug(`Multi put confirmed, entity: ${this.entityName}, ids ${R.pluck('id', entities)}`);
    }).catch(this.getErrorHandler(`Error on ${this.entityName} multi put`));
  }
}