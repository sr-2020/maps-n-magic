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
    this.logger = rest.logger;
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
      this.gameModel.logger.info('settings_are_empty');
      await this.dataProvider.post(R.clone(this.defaultSettings));
      settings = R.clone(this.defaultSettings);
    }
    // this.logger.info(this.settingsName, settings);

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
    if (name !== this.ccSettingsName) {
      return;
    }

    this.dataProvider.post(settings).then((settings2) => {
    // this.dataProvider.post(null).then((settings2) => {
      // this.entities.push(entity);
      this.settings = settings2;
      // console.log('onPostSettingsRequested', name, settings, settings2);
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
