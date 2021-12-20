import * as R from 'ramda';

import { GameModel, Identifiable, GMLogger, EntityUpdate } from "sr2020-mm-event-engine";

import { DataProvider, ReadStrategy } from "./types";

import { CrudDataManager } from './CrudDataManager';

import {
  ManageablePlusResourceProvider,
} from '../api/position';

export class LocationDataManager<
  Entity extends Identifiable, 
  T extends ManageablePlusResourceProvider<Entity>
> extends CrudDataManager<Entity, T> {
  inputChangeTimeout2: NodeJS.Timeout | null = null;
 
  constructor(
    gameModel: GameModel, 
    dataProvider: T, 
    entityName: string, 
    readStrategy: ReadStrategy,
    logger: GMLogger,
    name: string,
  ) {
    super(gameModel, dataProvider, entityName, readStrategy, logger, name);
    // this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntitiesRequested = this.onPutEntitiesRequested.bind(this);
    // this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
    this.setMetadata({
      // `put${this.ccEntityName}sConfirmed`
      listenEvents: [`put${this.ccEntityName}sRequested`]
    });
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel) {
    super.subscribe(action, gameModel);
    // gameModel[action](`post${this.ccEntityName}Requested`, this.onPostEntityRequested);
    gameModel[action](`put${this.ccEntityName}sRequested`, this.onPutEntitiesRequested);
    // gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  onPutEntitiesRequested({ updates }: { updates: EntityUpdate<Entity>[]; }) {
    if (this.inputChangeTimeout2 !== null){
      clearTimeout(this.inputChangeTimeout2);
    }

    this.inputChangeTimeout2 = setTimeout(() => {
      this.dataProvider.putMultiple({ updates }).then((entities) => {
        entities.forEach((entity) => {
          const index = this.entities.findIndex((br) => br.id === entity.id);
          this.entities[index] = entity;
        });
        this.gameModel.execute({
          type: `put${this.ccEntityName}sConfirmed`,
          [`${this.entityName}s`]: entities,
        });
      }).catch(this.getErrorHandler(`Error on ${this.entityName}s put`));
    }, 500);
  }
}
