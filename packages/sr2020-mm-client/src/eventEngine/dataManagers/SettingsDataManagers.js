// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { capitalizeFirstLetter } from './ReadDataManager';

export class ReadSettingsDataManager {
  constructor(gameModel, dataProvider, settingsName, readStrategy) {
    // this.entities = [];
    this.settings = {};
    this.gameModel = gameModel;
    this.settingsName = settingsName;
    // this.plural = `${entityName}s`;
    this.ccSettingsName = capitalizeFirstLetter(settingsName);
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
    this.dataProvider.get().then((settings) => {
      // if (R.equals(this.settings, settings)) {
      //   // console.log('no changes', this.ccEntityName);
      //   return;
      // }
      this.settings = settings;
      this.gameModel.execute({
        type: `set${this.ccSettingsName}`,
        [this.settingsName]: R.clone(this.settings),
      });
    }).catch(this.getErrorHandler(`Error on ${this.settingsName} loading`));
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


export class ReadWriteSettingsDataManager extends ReadSettingsDataManager {
  constructor(...args) {
    super(...args);
    this.onPostSettingsRequested = this.onPostSettingsRequested.bind(this);
    // this.onPutEntityRequested = this.onPutEntityRequested.bind(this);
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
    gameModel[action](`post${this.ccSettingsName}Requested`, this.onPostSettingsRequested);
    // gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
    // gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  // onPutEntityRequested({ id, props }) {
  //   clearTimeout(this.inputChangeTimeout);

  //   this.inputChangeTimeout = setTimeout(() => {
  //     this.dataProvider.put({ id, props }).then((entity) => {
  //       const index = this.entities.findIndex((br) => br.id === id);
  //       this.entities[index] = entity;
  //       this.gameModel.execute({
  //         type: `put${this.ccEntityName}Confirmed`,
  //         [this.entityName]: entity,
  //       });
  //     }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
  //   }, 500);
  // }

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

  onPostSettingsRequested(settings) {
    this.dataProvider.post(settings[this.settingsName]).then((settings2) => {
      // this.entities.push(entity);
      this.settings = settings2;
      this.gameModel.execute({
        type: `post${this.ccSettingsName}Confirmed`,
        [this.settingsName]: settings2,
      });
    }).catch(this.getErrorHandler(`Error on ${this.ccSettingsName} post`));
  }
}
