import * as R from 'ramda';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ReadDataManager {
  constructor() {
    this.entities = [];
  }

  initialize(gameModel, EntityHolder, entityName) {
    this.gameModel = gameModel;
    this.entityName = entityName;
    this.plural = `${entityName}s`;
    this.ccEntityName = capitalizeFirstLetter(entityName);
    this.holder = new EntityHolder();
    this.loadEntities();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}

  loadEntities() {
    this.holder.get().then((entities) => {
      this.entities = entities;
      this.gameModel.execute({
        type: `set${this.ccEntityName}s`,
        [this.plural]: R.clone(this.entities),
      });
    }).catch(this.getErrorHandler(`Error on ${this.entityName} loading`));
  }

  getErrorHandler(title) {
    return (err) => {
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
