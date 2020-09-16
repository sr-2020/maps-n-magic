import * as R from 'ramda';

import { CrudDataManager } from './CrudDataManager';

export class LocationDataManager extends CrudDataManager {
  constructor(...args) {
    super(...args);
    // this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntitiesRequested = this.onPutEntitiesRequested.bind(this);
    // this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
  }

  initialize() {
    super.initialize();
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    super.dispose();
    this.subscribe('off', this.gameModel);
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

  // onDeleteEntityRequested({ id }) {
  //   this.dataProvider.delete({ id }).then(() => {
  //     const entity = this.entities.find((br) => br.id === id);
  //     this.entities = this.entities.filter((br) => br.id !== id);
  //     this.gameModel.execute({
  //       type: `delete${this.ccEntityName}Confirmed`,
  //       [this.entityName]: entity,
  //     });
  //   }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  // }

  // onPostEntityRequested({ props }) {
  //   this.dataProvider.post({ props }).then((entity) => {
  //     this.entities.push(entity);
  //     this.gameModel.execute({
  //       type: `post${this.ccEntityName}Confirmed`,
  //       [this.entityName]: entity,
  //     });
  //   }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  // }
}
