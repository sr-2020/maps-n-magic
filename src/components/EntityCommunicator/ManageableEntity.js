import * as R from 'ramda';

import { GettableEntity } from './GettableEntity';

export class ManageableEntity extends GettableEntity {
  constructor() {
    super();
    this.onPostEntityRequested = this.onPostEntityRequested.bind(this);
    this.onPutEntityRequested = this.onPutEntityRequested.bind(this);
    this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
  }

  initialize(gameModel, EntityHolder, entityName) {
    super.initialize(gameModel, EntityHolder, entityName);
    this.subscribe('on', gameModel);
  }

  dispose() {
    super.dispose();
    this.subscribe('off', this.gameModel);
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action](`post${this.ccEntityName}Requested`, this.onPostEntityRequested);
    gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
    gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  onPutEntityRequested({ id, props }) {
    clearTimeout(this.inputChangeTimeout);

    this.inputChangeTimeout = setTimeout(() => {
      this.holder.put({ id, props }).then((entity) => {
        const index = this.entities.findIndex((br) => br.id === id);
        this.entities[index] = entity;
        this.gameModel.execute({
          type: `put${this.ccEntityName}Confirmed`,
          [this.entityName]: entity,
        });
      }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
    }, 500);
  }

  onDeleteEntityRequested({ id }) {
    this.holder.delete({ id }).then(() => {
      const entity = this.entities.find((br) => br.id === id);
      this.entities = this.entities.filter((br) => br.id !== id);
      this.gameModel.execute({
        type: `delete${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
  }

  onPostEntityRequested({ props }) {
    this.holder.post({ props }).then((entity) => {
      this.entities.push(entity);
      this.gameModel.execute({
        type: `post${this.ccEntityName}Confirmed`,
        [this.entityName]: entity,
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} post`));
  }
}
