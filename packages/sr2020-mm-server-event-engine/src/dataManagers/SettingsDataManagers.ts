// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { 
  GMLogger, 
  GameModel, 
  EPostNotification,
  PostSettingsConfirmed,
  EPostSettingsRequested,
  SettingsData,
  SetSettings,
  AbstractEventProcessor
} from "sr2020-mm-event-engine";

import { ReadStrategy, DataProvider } from "./types";
import { capitalizeFirstLetter } from './ReadDataManager';

import {
  SettingsResourceProvider
} from '../api/settings';

const metadata = {
  actions: [],
  requests: [],
  emitEvents: ['postNotification'],
  listenEvents: ['postSettingsRequested'],
  needRequests: [],
  needActions: ['setSettings','postSettingsConfirmed']
};

export class SettingsDataManager<U extends SettingsData, T extends SettingsResourceProvider<U>>
  extends AbstractEventProcessor {
  settings: U | null;

  defaultSettings: U;

  // logger: GMLogger;

  ccSettingsName: string;

  constructor(
    protected gameModel: GameModel, 
    private dataProvider: T, 
    private settingsName: string, 
    private readStrategy: ReadStrategy, 
    defaultSettings: U,
    protected logger: GMLogger,
    protected name: string,
  ) {
    super(gameModel, logger);
    // this.logger.info('SettingsDataManager rest', args);
    // this.entities = [];
    if (R.isNil(defaultSettings)) {
      throw new Error(`Default settings not specified, settingsName ${settingsName}`);
    }
    this.settings = null;
    this.defaultSettings = defaultSettings;
    // this.logger = rest.logger;
    // this.gameModel = gameModel;
    // this.settingsName = settingsName;
    // this.plural = `${entityName}s`;
    this.ccSettingsName = (settingsName);
    // this.ccSettingsName = capitalizeFirstLetter(settingsName);
    // this.dataProvider = dataProvider;
    // this.readStrategy = readStrategy;
    this.onPostSettingsRequested = this.onPostSettingsRequested.bind(this);
    this.setMetadata({
      emitEvents: ['postNotification'], // postSettingsConfirmed, setSettings
      listenEvents: ['postSettingsRequested']
    });
  }

  init() {
    this.readStrategy.init(this);
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

  getName() {
    return this.name;
  }

  subscribe(action: 'on' | 'off', gameModel: GameModel): void {
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
    let settings: U = await this.dataProvider.get();
    if (R.isNil(settings) || R.isEmpty(settings)) {
      this.logger.info('settings_are_empty', this.defaultSettings);
      await this.dataProvider.post(R.clone(this.defaultSettings));
      settings = R.clone(this.defaultSettings);
    }
    // this.logger.info(this.settingsName, settings);

    // .then((settings) => {
    // if (R.equals(this.settings, settings)) {
    //   // this.logger.info('no changes', this.ccEntityName);
    //   return;
    // }
    // this.logger.info('settings', JSON.stringify(settings));
    // this.gameModel.logger.info('settings', this.ccSettingsName, JSON.stringify(settings));
    // this.gameModel.logger.info('settings', this.ccSettingsName);
    // this.gameModel.logger.info('settings', settings);
    // throw new Error('sdfsdfsd');
    this.settings = settings;
    this.gameModel.execute2<SetSettings>({
      // type: `set${this.ccSettingsName}`,
      // [this.settingsName]: R.clone(this.settings),
      type: 'setSettings',
      // TODO - make explicit connection between settingsData and settingsName
      // @ts-ignore
      name: this.settingsName,
      // @ts-ignore
      settings: R.clone(this.settings),
    });
    // });
    // .catch(this.getErrorHandler(`Error on ${this.settingsName} loading`));

    // }).catch(this.getErrorHandler(`Error on ${this.settingsName} loading`));
  }

  getErrorHandler(title: string) {
    return (err: Error) => {
      this.logger.error(err);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title,
        message: err.message || String(err),
        kind: 'error',
      });
    };
  }

  onPostSettingsRequested({ name, settings }: EPostSettingsRequested) {
    if (name !== this.ccSettingsName) {
      return;
    }

    // TODO - make explicit connection between settingsData and settingsName
    // @ts-ignore
    this.dataProvider.post(settings).then((settings2) => {
    // this.dataProvider.post(null).then((settings2) => {
      // this.entities.push(entity);
      this.settings = settings2;
      // this.logger.info('onPostSettingsRequested', name, settings, settings2);
      this.gameModel.execute2<PostSettingsConfirmed>({
        // type: `post${this.ccSettingsName}Confirmed`,
        // [this.settingsName]: settings2,
        type: 'postSettingsConfirmed',
        name,
        // @ts-ignore
        settings: settings2,
      });
    }).catch(this.getErrorHandler(`Error on ${this.ccSettingsName} post`));
  }
}
