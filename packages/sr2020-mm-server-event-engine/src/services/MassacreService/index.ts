import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  RawCharacterHealthState,
  Typed,
  ECharacterHealthStateChanged,
  EMassacreTriggered,
  ServiceContract,
  ServiceContractTypes,
  ManaOceanEffectSettingsData,
  SettingsKeys,
  GetSettings
} from 'sr2020-mm-event-engine';

export type MassacreEmitEvents = EMassacreTriggered;
export type MassacreListenEvents = ECharacterHealthStateChanged;

export interface MassacreServiceContract extends ServiceContract {
  Request: never;
  Action: never;
  EmitEvent: MassacreEmitEvents;
  ListenEvent: MassacreListenEvents;
  NeedAction: never;
  NeedRequest: GetSettings;
}

const metadata: ServiceContractTypes<MassacreServiceContract> = {
  actions: [
    // 'onCharHealthUpdateReceived'
  ],
  requests: [],
  emitEvents: ['massacreTriggered'],
  listenEvents: ['characterHealthStateChanged'],
  needRequests: ['settings'],
  needActions: []
};
export class MassacreService extends AbstractService<MassacreServiceContract> {
  // key - locationId, 
  // value - array of timestamps when character falled in state 'wounded'
  characterHealthStats: Record<number, number[]>;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.characterHealthStats = {};
    this.onCharHealthChanged = this.onCharHealthChanged.bind(this);
  }

  init() {
    super.init();
    this.on2('characterHealthStateChanged', this.onCharHealthChanged);
  }

  dispose() {
    this.off2('characterHealthStateChanged', this.onCharHealthChanged);
  }

  onCharHealthChanged(data: ECharacterHealthStateChanged): void {
    // this.logger.info('massacre service', data);
    const { characterId, characterHealthState } = data;
    const { locationId, healthState, timestamp } = characterHealthState;
    if (healthState !== 'wounded') {
      return;
    }
    if (!locationId) {
      this.logger.info(`Character is wounded in unknown location, characterId: ${characterId}`);
      return;
    }
    this.logger.info('massacre service', characterId, locationId, healthState, timestamp);
    let locationList = this.characterHealthStats[locationId];
    if (!locationList) {
      locationList = [];
    }

    const massacreTimeWindow = 60000 * 5; // 5 min
    const windowStart = timestamp - massacreTimeWindow;
    locationList = locationList.filter((el) => el > windowStart);
    locationList.push(timestamp);

    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');

    const { massacrePeopleLimit } = manaOceanEffectSettings;
    if (locationList.length >= massacrePeopleLimit) {
      locationList = locationList.slice(massacrePeopleLimit);
      this.emit2({
        type: 'massacreTriggered',
        locationId,
        timestamp,
      });
      this.logger.info(`massacre detected, locationId ${locationId}`);
    }

    this.characterHealthStats[locationId] = locationList;
    // this.logger.info('characterHealthStats', JSON.stringify(this.characterHealthStats, null, '  '));
    this.logger.info('characterHealthStats', this.characterHealthStats);

    // massacre service {
    //   type: 'characterHealthStateChanged',
    //   characterId: 10201,
    //   characterHealthState: {
    //     locationId: 3061,
    //     locationLabel: 'РКИ',
    //     healthState: 'healthy',
    //     timestamp: 1602036601925,
    //     lifeStyle: 'Bronze',
    //     personName: 'Мэрфи в группе Мастера и приложение'
    //   },
    // }
  }

  getSettings<T>(name: SettingsKeys): T {
    return this.getFromModel<any, T>({
      type: 'settings',
      name,
    });
  }
}
