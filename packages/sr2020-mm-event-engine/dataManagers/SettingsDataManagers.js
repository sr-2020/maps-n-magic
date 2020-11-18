// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { capitalizeFirstLetter } from './ReadDataManager';

export class SettingsDataManager {
  constructor(gameModel, dataProvider, settingsName, readStrategy, rest) {
    // console.log('SettingsDataManager rest', args);
    // this.entities = [];
    if (R.isNil(rest.defaultSettings)) {
      throw new Error(`Default settings not specified, settingsName ${settingsName}`);
    }
    this.settings = {};
    this.defaultSettings = rest.defaultSettings;
    this.gameModel = gameModel;
    this.settingsName = settingsName;
    // this.plural = `${entityName}s`;
    this.ccSettingsName = (settingsName);
    // this.ccSettingsName = capitalizeFirstLetter(settingsName);
    this.dataProvider = dataProvider;
    this.readStrategy = readStrategy;
    this.onPostSettingsRequested = this.onPostSettingsRequested.bind(this);
  }

  initialize() {
    this.readStrategy.initialize(this);
    // super.initialize();
    this.subscribe('on', this.gameModel);
    // this.onPostSettingsRequested({
    //   name: 'manaOcean',
    //   settings: null,
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.readStrategy.dispose();
    // super.dispose();
    this.subscribe('off', this.gameModel);
  }

  subscribe(action, gameModel) {
    // gameModel[action](`post${this.ccSettingsName}Requested`, this.onPostSettingsRequested);
    gameModel[action]('postSettingsRequested', this.onPostSettingsRequested);
    // gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
    // gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
  }

  async load() {
    // this.dataProvider.post({
    //   minManaLevel: 1,
    //   neutralManaLevel: 4,
    //   maxManaLevel: 7,
    //   visibleMoonPeriod: 180, // minutes
    //   visibleMoonNewMoonTime: 0,
    //   visibleMoonManaTideHeight: 1,
    //   invisibleMoonPeriod: 270,
    //   invisibleMoonNewMoonTime: 120,
    //   invisibleMoonManaTideHeight: 1,
    //   moscowTime: 0,
    // }).then((el) => {
    let settings = await this.dataProvider.get();
    if (R.isNil(settings) || R.isEmpty(settings)) {
      // settingsName
      this.gameModel.logger.info('settings_are_empty');
      await this.dataProvider.post(R.clone(this.defaultSettings));
      settings = R.clone(this.defaultSettings);
    }

    // .then((settings) => {
    // if (R.equals(this.settings, settings)) {
    //   // console.log('no changes', this.ccEntityName);
    //   return;
    // }
    // console.log('settings', JSON.stringify(settings));
    // this.gameModel.logger.info('settings', this.ccSettingsName, JSON.stringify(settings));
    // this.gameModel.logger.info('settings', this.ccSettingsName);
    // this.gameModel.logger.info('settings', settings);
    // throw new Error('sdfsdfsd');
    this.settings = settings;
    this.gameModel.execute({
      // type: `set${this.ccSettingsName}`,
      // [this.settingsName]: R.clone(this.settings),
      type: 'setSettings',
      name: this.settingsName,
      settings: R.clone(this.settings),
    });
    // });
    // .catch(this.getErrorHandler(`Error on ${this.settingsName} loading`));

    // }).catch(this.getErrorHandler(`Error on ${this.settingsName} loading`));
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

  onPostSettingsRequested({ name, settings }) {
    this.dataProvider.post(settings).then((settings2) => {
    // this.dataProvider.post(null).then((settings2) => {
      // this.entities.push(entity);
      this.settings = settings2;
      this.gameModel.execute({
        // type: `post${this.ccSettingsName}Confirmed`,
        // [this.settingsName]: settings2,
        type: 'postSettingsConfirmed',
        name,
        settings: settings2,
      });
    }).catch(this.getErrorHandler(`Error on ${this.ccSettingsName} post`));
  }
}

// export class ReadWriteSettingsDataManager extends ReadSettingsDataManager {
//   constructor(...args) {
//     super(...args);
//     this.onPostSettingsRequested = this.onPostSettingsRequested.bind(this);
//     // this.onPutEntityRequested = this.onPutEntityRequested.bind(this);
//     // this.onDeleteEntityRequested = this.onDeleteEntityRequested.bind(this);
//   }

//   initialize() {
//     super.initialize();
//     this.subscribe('on', this.gameModel);
//     this.onPostSettingsRequested({
//       name: 'manaOcean',
//       settings: null,
//     });
//   }

//   dispose() {
//     super.dispose();
//     this.subscribe('off', this.gameModel);
//   }

//   // eslint-disable-next-line react/sort-comp
//   subscribe(action, gameModel) {
//     // gameModel[action](`post${this.ccSettingsName}Requested`, this.onPostSettingsRequested);
//     gameModel[action]('postSettingsRequested', this.onPostSettingsRequested);
//     // gameModel[action](`put${this.ccEntityName}Requested`, this.onPutEntityRequested);
//     // gameModel[action](`delete${this.ccEntityName}Requested`, this.onDeleteEntityRequested);
//   }

//   // onPutEntityRequested({ id, props }) {
//   //   clearTimeout(this.inputChangeTimeout);

//   //   this.inputChangeTimeout = setTimeout(() => {
//   //     this.dataProvider.put({ id, props }).then((entity) => {
//   //       const index = this.entities.findIndex((br) => br.id === id);
//   //       this.entities[index] = entity;
//   //       this.gameModel.execute({
//   //         type: `put${this.ccEntityName}Confirmed`,
//   //         [this.entityName]: entity,
//   //       });
//   //     }).catch(this.getErrorHandler(`Error on ${this.entityName} put`));
//   //   }, 500);
//   // }

//   // onDeleteEntityRequested({ id }) {
//   //   this.dataProvider.delete({ id }).then(() => {
//   //     const entity = this.entities.find((br) => br.id === id);
//   //     this.entities = this.entities.filter((br) => br.id !== id);
//   //     this.gameModel.execute({
//   //       type: `delete${this.ccEntityName}Confirmed`,
//   //       [this.entityName]: entity,
//   //     });
//   //   }).catch(this.getErrorHandler(`Error on ${this.entityName} delete`));
//   // }

//   onPostSettingsRequested({ name, settings }) {
//     this.dataProvider.post(settings).then((settings2) => {
//     // this.dataProvider.post(null).then((settings2) => {
//       // this.entities.push(entity);
//       this.settings = settings2;
//       this.gameModel.execute({
//         // type: `post${this.ccSettingsName}Confirmed`,
//         // [this.settingsName]: settings2,
//         type: 'postSettingsConfirmed',
//         name,
//         settings: settings2,
//       });
//     }).catch(this.getErrorHandler(`Error on ${this.ccSettingsName} post`));
//   }
// }
