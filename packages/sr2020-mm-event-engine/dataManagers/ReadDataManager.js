// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export class ReadDataManager {
  constructor(gameModel, dataProvider, entityName, readStrategy) {
    this.entities = [];
    this.gameModel = gameModel;
    this.entityName = entityName;
    this.plural = `${entityName}s`;
    this.ccEntityName = capitalizeFirstLetter(entityName);
    this.dataProvider = dataProvider;
    this.readStrategy = readStrategy;
  }

  initialize() {
    this.readStrategy.initialize(this);
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.readStrategy.dispose();
  }

  load() {
    console.log(`load ${this.entityName}`);
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
