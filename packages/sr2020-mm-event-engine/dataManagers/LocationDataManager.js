import * as R from 'ramda';

import { CrudDataManager } from './CrudDataManager';

export class LocationDataManager extends CrudDataManager {
  constructor(...args) {
    super(...args);
    // this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntitiesRequested = this.onPutEntitiesRequested.bind(this);
    // this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    super.subscribe(action, gameModel);
    // gameModel[action](`post${this.ccEntityName}Requested`, this.onPostEntityRequested);
    gameModel[action](`put${this.ccEntityName}sRequested`, this.onPutEntitiesRequested);
    // gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  onPutEntitiesRequested({ updates }) {
    clearTimeout(this.inputChangeTimeout2);

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
