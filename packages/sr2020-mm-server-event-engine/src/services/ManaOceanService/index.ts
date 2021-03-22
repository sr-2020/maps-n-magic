// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import shortid from 'shortid';
import moment from 'moment-timezone';

import { 
  AbstractService,
  getMoscowTime, 
  getTideHeight2,
  isGeoLocation, 
  shuffle,
  Metadata,
  ManaOceanEffectSettingsData,
  ManaOceanSettingsData,
  SettingsKeys,
  SettingsValues,
  LocationRecord,
  GameModel,
  GMLogger,
  RitualLocationEffect,
  PowerSpellEffect,
  SpellEffect,
  ManaOceanEffect,
  LocationRecordOptions,
  MassacreEffect
} from 'sr2020-mm-event-engine';

import { 
  SpellCast,
} from "../../types";

// import { manaOceanEffectSettings } from '../api/constants';

const TIDE_LEVEL_UPDATE_INTERVAL: number = 5000; // millis

const MANA_TIDE_UPDATE_INTERVAL: number = 10000; // millis
// const MANA_TIDE_UPDATE_INTERVAL = 30000; // millis
// const MANA_TIDE_UPDATE_INTERVAL = 60000 * 10; // millis

// let counter = 1;

interface LocationUpdate {
  id: number;
  body: {
    options: LocationRecordOptions
  }
}

type OptionsIndex = Record<number, {
  manaLevel: number,
  effectList: ManaOceanEffect[]
}>

class EffectCollector {
  index: {
    [locationId: number]: {
      locationRecord: LocationRecord,
      effects: ManaOceanEffect[]
    }
  } = {};

  addEffect(locationRecord: LocationRecord, effect: ManaOceanEffect): void {
    const { id } = locationRecord;
    let record = this.index[id];
    if (record === undefined) {
      record = {
        locationRecord,
        effects: [],
      };
      this.index[id] = record;
    }
    record.effects.push(effect);
  }

  toLocationUpdates(): LocationUpdate[] {
    return R.values(this.index).map(({ locationRecord, effects }) => {
      const { effectList = [] } = locationRecord.options;
      return {
        id: locationRecord.id,
        body: {
          options: {
            ...locationRecord.options,
            effectList: R.concat(effectList, effects),
          },
        },
      };
    });
  }
}

const metadata: Metadata = {
  actions: [
    'spellCast',
    'wipeManaOceanEffects',
    'removeManaEffect',
    'addManaEffect',
    // 'postManaOceanSettings',
    // 'postManaOceanSettingsConfirmed',
  ],
  requests: [
  ],
  emitEvents: [
    // 'postManaOceanSettings',
    // 'postManaOceanSettingsRequested',
  ],
  needActions: [
    'putLocationRecord',
    'putLocationRecords',
    'pushNotification',
  ],
  needRequests: [
    // 'manaOceanSettings',
    'settings',
    'locationRecords',
    'locationRecord',
    'enableManaOcean',
    'neighborOrRandomLocation',
    'neighborList',
  ],
  listenEvents: ['massacreTriggered'],
};

export class ManaOceanService extends AbstractService {
  prevTideHeight: number;

  tideLevelTimerId: NodeJS.Timeout;

  lastManaUpdateTimestamp: number;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    this.prevTideHeight = null;
    this.tideLevelTimerId = null;
    // this.manaModifiers = [];
    this.onTideLevelUpdate = this.onTideLevelUpdate.bind(this);
    this.onMassacreTriggered = this.onMassacreTriggered.bind(this);
    // this.getManaOptions = this.getManaOptions.bind(this);
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  init(): void {
    super.init();
    if (this.tideLevelTimerId === null) {
      this.tideLevelTimerId = setInterval(this.onTideLevelUpdate, TIDE_LEVEL_UPDATE_INTERVAL);
    } else {
      this.logger.error('tideLevelTimer already initialized');
    }
    this.on('massacreTriggered', this.onMassacreTriggered);
  }

  dispose(): void {
    if (this.tideLevelTimerId !== null) {
      clearInterval(this.tideLevelTimerId);
    }
    this.off('massacreTriggered', this.onMassacreTriggered);
  }

  spellCast(data: SpellCast): void {
    this.logger.info('spellCast', data);

    // {
    //   timestamp: moment.utc().valueOf(), // Unix time в миллисекундах
    //   id: 'stone-skin', // id спелла из сводной таблички
    //   name: 'Skin stoner', // человекочитаемое название спелла
    //   characterId: '10198', // персонаж применивший спелл
    //   location: {
    //     id: 3065, // район силовиков
    //     manaLevel: 10,
    //   },
    //   power: 7, // мощь спелла
    //   reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
    //   ritualMembersIds: ['555', '666'], // идентификаторы участников ритуала
    //   ritualVictimIds: ['111', '222'], // идентификаторы жертв ритуала
    //   // целевой персонаж (если данная способность имеет целевого персонажа),
    //   // иначе пусто
    //   targetCharacterId: '10246',
    // }
    const locationId = data.location.id;
    const locationRecord: LocationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      this.logger.error('location not found', locationId);
      if (data.id === 'input-stream' || data.id === 'output-stream') {
        const {
          characterId, name,
        } = data;
        this.executeOnModel({
          type: 'pushNotification',
          characterId,
          title: `Заклинание ${name} не применено`,
          message: `Не найдена локация заклинания, id локации ${data.location.id}`,
        });
      }
      return;
    }
    const effectCollector = new EffectCollector();
    this.processPowerSpell(data, effectCollector);
    this.processRitualCast(data, effectCollector);
    this.processManaOceanSpells(data, effectCollector, locationRecord);
    const updates: LocationUpdate[] = effectCollector.toLocationUpdates();
    if (updates.length > 0) {
      this.pushEffects(updates);
    }
    // this.logger.info('effectCollector', JSON.stringify(effectCollector.index, null, '  '));
  }

  processManaOceanSpells(data: SpellCast, effectCollector: EffectCollector, locationRecord: LocationRecord): void {
    const {
      id, power, timestamp, characterId, name,
    } = data;

    // Пока не кончится заклинание, мана из соседних локаций будет призываться в эту
    // (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность.

    // В течение Мощь*3 минут каждые 60с будет сделана попытка
    // (с вероятностью Мощь*20. Значение больше 100% учитывать как 100%)
    // вытянуть 1 уровень плотности маны из случайной соседней локации (там понизится, тут повысится).

    // В течение Мощь*3 минут каждые 60с будет сделана попытка
    // (с вероятностью Мощь*20. Значение больше 100% учитывать как 100%)
    // выгнать 1 уровень плотности маны в случайную соседнюю локацию (там понизится, тут повысится).

    // 0 1 2 3 4 5 - момент каста уже считается попыткой
    // 0 1 4 5
    if (id !== 'input-stream' && id !== 'output-stream') {
      return;
    }

    this.executeOnModel({
      type: 'pushNotification',
      characterId,
      title: `Заклинание ${name} применено`,
      message: `Мощь ${power}, локация: ${locationRecord.label}`,
    });

    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');
    const startTime = timestamp;
    const endTime = startTime + power
    * manaOceanEffectSettings.spellDurationPerPower
    * manaOceanEffectSettings.spellDurationItem;
    const probability = Math.min(1, power * (manaOceanEffectSettings.spellProbabilityPerPower / 100));
    let range = R.range(0, power * manaOceanEffectSettings.spellDurationPerPower);
    if (probability < 1) {
      range = range.filter(() => Math.random() < probability);
    }

    effectCollector.addEffect(locationRecord, {
      type: id === 'input-stream' ? 'inputStream' : 'outputStream',
      id: shortid.generate(),
      start: startTime,
      end: endTime,
      manaLevelChange: id === 'input-stream' ? 1 : -1,
      locationId: locationRecord.id,
      range,
    } as SpellEffect);

    // range.forEach((el) => {
    //   const neighborLocation = this.getFromModel({
    //     type: 'neighborOrRandomLocation',
    //     locationId: locationRecord.id,
    //   });
    //   if (neighborLocation == null) {
    //     return;
    //   }
    //   effectCollector.addEffect(locationRecord, {
    //     type: id === 'input-stream' ? 'inputStreamStart' : 'outputStreamStart',
    //     id: shortid.generate(),
    //     start: startTime + el * manaOceanEffectSettings.spellDurationItem,
    //     end: endTime,
    //     manaLevelChange: id === 'input-stream' ? 1 : -1,
    //     locationId,
    //   });
    //   effectCollector.addEffect(neighborLocation, {
    //     type: id === 'input-stream' ? 'inputStreamNeighbor' : 'outputStreamNeighbor',
    //     id: shortid.generate(),
    //     start: startTime + el * manaOceanEffectSettings.spellDurationItem,
    //     end: endTime,
    //     manaLevelChange: id === 'input-stream' ? -1 : 1,
    //     locationId: neighborLocation.id,
    //   });
    // });
    // this.logger.info({
    //   startTime,
    //   endTime,
    //   range,
    // });
  }

  processRitualCast(data: SpellCast, effectCollector: EffectCollector): void {
    const { timestamp, ritualMembersIds, ritualVictimIds } = data;
    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');
    if (ritualMembersIds.length + ritualVictimIds.length
      < manaOceanEffectSettings.ritualMembersBoundary) {
      return;
    }
    const locationId = data.location.id;
    const locationRecord: LocationRecord = this.getLocation(locationId);
    // this.logger.info('dssd');
    // const neighborLocation = this.getFromModel({
    //   type: 'neighborOrRandomLocation',
    //   locationId: locationRecord.id,
    // });
    // if (neighborLocation == null) {
    //   return;
    // }
    // this.logger.info('neighborLocation', { neighborLocation });

    effectCollector.addEffect(locationRecord, {
      type: 'ritualLocation',
      id: shortid.generate(),
      start: timestamp + manaOceanEffectSettings.ritualDelay,
      // start: timestamp,
      manaLevelChange: -1,
      permanent: true,
      locationId,
    } as RitualLocationEffect);
    // effectCollector.addEffect(neighborLocation, {
    //   type: 'ritualNeighborLocation',
    //   id: shortid.generate(),
    //   start: timestamp + manaOceanEffectSettings.ritualDelay,
    //   manaLevelChange: 1,
    //   permanent: true,
    //   locationId: neighborLocation.id,
    // });
  }

  processPowerSpell(data: SpellCast, effectCollector: EffectCollector): void {
    const { timestamp, power } = data;
    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');
    if (power < manaOceanEffectSettings.powerSpellBoundary) {
      return;
    }
    const locationId = data.location.id;
    const locationRecord: LocationRecord = this.getLocation(locationId);

    effectCollector.addEffect(locationRecord, {
      type: 'powerSpell',
      id: shortid.generate(),
      start: timestamp
      + manaOceanEffectSettings.powerSpellDelay,
      end: timestamp
      + manaOceanEffectSettings.powerSpellDelay
      + manaOceanEffectSettings.powerSpellDuration,
      manaLevelChange: -1,
      locationId,
    } as PowerSpellEffect);
  }

  onMassacreTriggered(data: {
    locationId: number,
    timestamp: number
  }): void {
    const { locationId, timestamp } = data;
    // {
    //   type: 'massacreTriggered',
    //   locationId: 3061,
    //   timestamp: 1602203600686
    // }
    // this.manaModifiers.push(data);
    const locationRecord: LocationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      this.logger.error('location not found', locationId);
      return;
    }
    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');
    
    this.pushEffect(locationRecord, {
      type: 'massacre',
      id: shortid.generate(),
      start: timestamp + manaOceanEffectSettings.massacreDelay, // start after 15 minutes
      end: timestamp
      + manaOceanEffectSettings.massacreDelay
      + manaOceanEffectSettings.massacreDuration, // end after 30 minutes
      manaLevelChange: 1,
      locationId,
    } as MassacreEffect);
    // // this.logger.info('manaModifiers', this.manaModifiers, shortid.generate(), data, locationRecord);
  }

  getLocation(locationId: number): LocationRecord {
    return this.getFromModel<any, LocationRecord>({
      type: 'locationRecord',
      id: locationId,
    });
  }

  pushEffect(locationRecord: LocationRecord, effect: ManaOceanEffect): void {
    const { effectList = [] } = locationRecord.options;
    // effectList = [];
    effectList.push(effect);
    this.logger.info('pushEffect', locationRecord.id, locationRecord.label, effect.type);
    this.executeOnModel({
      type: 'putLocationRecord',
      id: locationRecord.id,
      props: {
        options: {
          ...locationRecord.options,
          effectList,
        },
      },
    });
  }

  pushEffects(updates: LocationUpdate[]): void {
    // this.logger.info('pushEffects', updates);
    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
  }

  addManaEffect(data: {
    locationId: number,
    effectType: 'massacre' | 'powerSpell'
  }): void {
    // this.logger.info('addManaEffect', data);
    const { locationId, effectType } = data;
    const locationRecord: LocationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      this.logger.error('location not found', locationId);
      return;
    }
    if (effectType !== 'massacre' && effectType !== 'powerSpell') {
      return;
    }
    const manaOceanEffectSettings: ManaOceanEffectSettingsData = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');

    // const { moscowTime } = getMoscowTime();
    // const timestamp = moscowTime.utc().valueOf();
    const timestamp: number = moment.utc().valueOf();
    let effect: ManaOceanEffect;
    if (effectType === 'massacre') {
      effect = {
        type: 'massacre',
        id: shortid.generate(),
        start: timestamp,
        end: timestamp + manaOceanEffectSettings.massacreDuration,
        manaLevelChange: 1,
        locationId,
      } as MassacreEffect;
    }
    if (effectType === 'powerSpell') {
      effect = {
        type: 'powerSpell',
        id: shortid.generate(),
        start: timestamp,
        end: timestamp + manaOceanEffectSettings.powerSpellDuration,
        manaLevelChange: -1,
        locationId,
      } as PowerSpellEffect;
    }

    const { options } = locationRecord;
    // const newEffectList = options.effectList.filter((el) => el.id !== effectId);
    this.executeOnModel({
      type: 'putLocationRecord',
      id: locationRecord.id,
      props: {
        options: {
          ...locationRecord.options,
          effectList: [...options.effectList, effect],
        },
      },
    });
  }

  removeManaEffect(data: {
    locationId: number,
    effectId: string
  }): void {
    const { locationId, effectId } = data;
    const locationRecord: LocationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      this.logger.error('location not found', locationId);
      return;
    }

    const { options } = locationRecord;
    const newEffectList: ManaOceanEffect[] = options.effectList.filter((el) => el.id !== effectId);
    this.executeOnModel({
      type: 'putLocationRecord',
      id: locationRecord.id,
      props: {
        options: {
          ...locationRecord.options,
          effectList: newEffectList,
        },
      },
    });

    // this.logger.info('removeManaEffect', data);
  }

  wipeManaOceanEffects(): void {
    // this.logger.info('wipeManaOceanEffects');
    const manaOceanSettings: ManaOceanSettingsData = this.getSettings<ManaOceanSettingsData>('manaOcean');
    const locationRecords: LocationRecord[] = this.getFromModel<any, LocationRecord[]>('locationRecords');
    const { neutralManaLevel } = manaOceanSettings;
    const geoLocations = locationRecords.filter(isGeoLocation);
    const curTimestamp = moment.utc().valueOf();

    const tideHeight = this.getNextTideHeight(curTimestamp, manaOceanSettings);

    this.prevTideHeight = tideHeight;

    const updates: LocationUpdate[] = geoLocations.reduce((acc: LocationUpdate[], location: LocationRecord) => {
      const newOptions: LocationRecordOptions = {
        ...location.options,
        // manaLevelModifiers: {
        //   neutralManaLevel,
        //   tideHeight,
        //   effects: [],
        // },
        effectList: [],
        manaLevel: null,
      };
      newOptions.manaLevel = this.calcManaLevel([neutralManaLevel, tideHeight]);
      if (!R.isNil(newOptions)) {
        acc.push({
          id: location.id,
          body: {
            options: newOptions,
          },
        });
      }
      return acc;
    }, [] as LocationUpdate[]);

    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  onTideLevelUpdate2(): void {
    const enableManaOcean: boolean = this.getFromModel<any, boolean>('enableManaOcean');
    const manaOceanSettings: ManaOceanSettingsData = this.getSettings<ManaOceanSettingsData>('manaOcean');
    // this.logger.info('manaOceanSettings', manaOceanSettings);

    if (!enableManaOcean || !manaOceanSettings) {
      return;
    }
    const curTimestamp = moment.utc().valueOf();
    const locationRecords: LocationRecord[] = this.getFromModel<any, LocationRecord[]>('locationRecords');
    const { neutralManaLevel, minManaLevel, maxManaLevel } = manaOceanSettings;

    const geoLocations: LocationRecord[] = locationRecords.filter(isGeoLocation);

    const tideHeight: number = this.getNextTideHeight(curTimestamp, manaOceanSettings);
    this.prevTideHeight = tideHeight;

    const getEffectList = R.pipe<LocationRecord, LocationRecordOptions>(
      R.prop<string, LocationRecordOptions>('options'),
      R.prop<string, ManaOceanEffect[]>('effectList'),
      // @ts-ignore
      R.defaultTo<ManaOceanEffect[]>([]),
    ) as (el: LocationRecord) => ManaOceanEffect[];

    type ApplicableManaOceanEffect = ManaOceanEffect & {
      isApplicable: boolean;
    }

    const getFullEffectList = R.pipe(
      R.map(getEffectList),
      R.unnest as (arr: ManaOceanEffect[][]) => ManaOceanEffect[],
      // @ts-ignore
      R.sortBy(R.prop<string, ManaOceanEffect>('start')),
      // @ts-ignore
      R.filter((effect: ManaOceanEffect) => effect.permanent || effect.end > curTimestamp),
      R.map((effect: ManaOceanEffect) => ({ ...effect, isApplicable: effect.start < curTimestamp })),
    ) as (locs: LocationRecord[]) => ApplicableManaOceanEffect[];

    const list: ApplicableManaOceanEffect[] = getFullEffectList(geoLocations);
    // this.logger.info('list', list);

    const prevOptIndex = geoLocations.reduce((acc, location) => {
      acc[location.id] = {
        manaLevel: location.options.manaLevel,
        effectList: location.options.effectList,
      };
      return acc;
    }, {} as OptionsIndex);

    // this.logger.info('getEffectList', getEffectList(geoLocations[0]));

    const optIndex = geoLocations.reduce((acc, location) => {
      acc[location.id] = {
        manaLevel: neutralManaLevel + tideHeight,
        effectList: [],
      };
      return acc;
    }, {} as OptionsIndex);

    // this.logger.info('optIndex', optIndex);

    list.forEach((effect: ApplicableManaOceanEffect) => {
      // this.logger.info('optIndex', optIndex);
      // this.logger.info('effect type:', effect.type);
      const options = optIndex[effect.locationId];
      options.effectList.push(effect);
      if (effect.isApplicable) {
        switch (effect.type) {
        case 'massacre':
          if (options.manaLevel < maxManaLevel) {
            options.manaLevel += effect.manaLevelChange;
          }
          break;
        case 'powerSpell':
          if (options.manaLevel > minManaLevel) {
            options.manaLevel += effect.manaLevelChange;
          }
          break;
        case 'ritualLocation':
          this.onApplyRitualLocation(optIndex, effect, manaOceanSettings);
          break;
        case 'inputStream':
        case 'outputStream':
          this.onApplyManaSpell(optIndex, effect, manaOceanSettings, curTimestamp);
          break;
        default:
          // do nothing
        }
      }
    });

    // this.logger.info('prevOptIndex', prevOptIndex);
    // this.logger.info('optIndex', optIndex);
    const changedPairs = R.difference(R.toPairs(optIndex), R.toPairs(prevOptIndex));
    const changedOpts = R.fromPairs(changedPairs);
    // this.logger.info('changedOpts', changedOpts);
    // @ts-ignore TODO - check if this case corrupts data!!!!!!!!!
    const updates: LocationUpdate[] = changedPairs.map(([id, options]) => ({
      id: Number(id),
      body: {
        options,
      },
    }));

    // this.logger.info('updates.length', updates.length);
    if (updates.length === 0) {
      this.logger.info('no updates for mana ocean');
      return;
    }

    // this.logger.info('updates', updates);

    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });

    // const nonNeutralOpts = R.filter((el) => (el.manaLevel !== (neutralManaLevel + tideHeight)), optIndex);
    // this.logger.info('optIndex', JSON.stringify(nonNeutralOpts, null, '  '));
  }

  // eslint-disable-next-line max-lines-per-function
  onApplyManaSpell(    
    optIndex: OptionsIndex, 
    effect: SpellEffect, 
    manaOceanSettings: ManaOceanSettingsData, 
    curTimestamp: number
  ): void {
    const { neutralManaLevel, minManaLevel, maxManaLevel } = manaOceanSettings;
    const options = optIndex[effect.locationId];
    // this.logger.info('onApplyManaSpell: effect', effect);
    const { type, range, start } = effect;
    const manaOceanEffectSettings = this.getSettings<ManaOceanEffectSettingsData>('manaOceanEffects');
    // if( type === 'inputStream' ? options.manaLevel < maxManaLevel : options.manaLevel > minManaLevel) {
    // if( options.manaLevel < maxManaLevel) {
    // has applicable mana transfers check
    const applicableItems = range.filter((point) => (start + point * manaOceanEffectSettings.spellDurationItem) < curTimestamp);

    function getMaxDelta(): number {
      return type === 'inputStream' ? maxManaLevel - options.manaLevel : options.manaLevel - minManaLevel;
    }
    function hasPlaceForMana(id: number): boolean {
      return type === 'inputStream' ? optIndex[id].manaLevel > minManaLevel : optIndex[id].manaLevel < maxManaLevel;
    }
    function isNeighborManaPlaceEnded(id: number): boolean {
      return type === 'inputStream' ? optIndex[id].manaLevel === minManaLevel
        : optIndex[id].manaLevel === maxManaLevel;
    }
    const maxApplicableNum = Math.min(applicableItems.length, getMaxDelta());

    if (maxApplicableNum === 0) {
      // this.logger.info('onApplyManaSpell: no applicable items');
      return;
    }
    const neighborList = this.getFromModel<any, LocationRecord[]>({
      type: 'neighborList',
      locationId: effect.locationId,
    });
    // this.logger.info('onApplyManaSpell: neighborList', neighborList);
    if (neighborList == null) {
      // this.logger.info('onApplyManaSpell: no neighbors');
      return;
    }
    const neighborIds = R.pluck('id', neighborList);
    const prepareIds = R.pipe(
      R.filter(hasPlaceForMana),
      shuffle,
    ) as (ids: number[]) => number[];
    let neighborIds2 = prepareIds(neighborIds);
    if (effect.prevNeighborIds === undefined) {
      effect.prevNeighborIds = [];
    }
    for (let i = 0; i < maxApplicableNum; i++) {
      if (neighborIds2.length === 0) {
        break;
      }
      // const element = array[i];
      let neighborId = effect.prevNeighborIds[i];
      if (neighborId === undefined || isNeighborManaPlaceEnded(neighborId)) {
        // eslint-disable-next-line prefer-destructuring
        neighborId = neighborIds2[0];
      }
      effect.prevNeighborIds[i] = neighborId;
      const neighborOptions = optIndex[neighborId];
      options.manaLevel += effect.manaLevelChange;
      // effect.neighborId = neighborLocation.id;
      neighborOptions.manaLevel -= effect.manaLevelChange;
      neighborIds2 = prepareIds(neighborIds);
    }
  }

  onApplyRitualLocation(
    optIndex: OptionsIndex, 
    effect: RitualLocationEffect, 
    manaOceanSettings: ManaOceanSettingsData
  ): void {
    const { neutralManaLevel, minManaLevel, maxManaLevel } = manaOceanSettings;
    const options = optIndex[effect.locationId];
    // this.logger.info('onApplyRitualLocation: effect', effect);
    if (options.manaLevel > minManaLevel) {
      if (effect.neighborId !== undefined) {
        const neighborOptions = optIndex[effect.neighborId];
        if (neighborOptions.manaLevel < maxManaLevel) {
          options.manaLevel += effect.manaLevelChange;
          neighborOptions.manaLevel -= effect.manaLevelChange;
          // this.logger.info('onApplyRitualLocation: repeated ritual effect');
          return;
        }
      }
      const neighborList = this.getFromModel<any, LocationRecord[]>({
        type: 'neighborList',
        locationId: effect.locationId,
      });
      // this.logger.info('onApplyRitualLocation: neighborList', neighborList);
      if (neighborList == null) {
        // this.logger.info('onApplyRitualLocation: no neighbors');
        return;
      }
      const list2 = shuffle(neighborList);
      const neighborLocation = list2.find((el) => {
        const neighborOptions = optIndex[el.id];
        return neighborOptions.manaLevel < maxManaLevel;
      });
      if (neighborLocation !== undefined) {
        const neighborOptions = optIndex[neighborLocation.id];
        options.manaLevel += effect.manaLevelChange;
        effect.neighborId = neighborLocation.id;
        neighborOptions.manaLevel -= effect.manaLevelChange;
        // this.logger.info('onApplyRitualLocation: applied ritual effect');
      } else {
        // this.logger.info('onApplyRitualLocation: ritual loc has no neighbor with place for mana');
      }
    } else {
      // this.logger.info('onApplyRitualLocation: ritual loc has no mana');
    }
  }

  onTideLevelUpdate(): void {
    this.onTideLevelUpdate2();
    // const enableManaOcean = this.getFromModel('enableManaOcean');
    // if (!enableManaOcean) {
    //   return;
    // }
    // // counter++;
    // const curTimestamp = moment.utc().valueOf();

    // const manaOceanSettings = this.getFromModel({
    //   type: 'settings',
    //   name: 'manaOcean',
    // });
    // const locationRecords = this.getFromModel('locationRecords');
    // const { neutralManaLevel } = manaOceanSettings;

    // const geoLocations = locationRecords.filter(isGeoLocation);

    // // const geoLocationIndex = R.indexBy(R.prop('id'), geoLocations);

    // // const firstLocation = locationRecords.find(isGeoLocation);
    // // if (!firstLocation) {
    // //   return;
    // // }

    // let { moscowTimeInMinutes, moscowTime } = getMoscowTime();
    // // speed up time, 1 second is 1 minute
    // moscowTimeInMinutes = (moscowTime.minute() * 60 + moscowTime.second()) % 1440;
    // // const tideHeight = getTideHeight2(moscowTimeInMinutes, manaOceanSettings);

    // // if (this.prevTideHeight === tideHeight) {
    // //   this.logger.info('Tide height not changed, skip mana level update');
    // //   return;
    // // }
    // const tideHeight = this.getNextTideHeight(curTimestamp);

    // this.prevTideHeight = tideHeight;

    // // this.logger.info('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight, firstLocation);
    // this.logger.info('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight);

    // const updates = geoLocations.reduce((acc, location) => {
    //   const newOptions = this.getManaOptions(location, tideHeight, neutralManaLevel, curTimestamp);
    //   if (!R.isNil(newOptions)) {
    //     acc.push({
    //       id: location.id,
    //       body: {
    //         options: newOptions,
    //       },
    //     });
    //   }
    //   return acc;
    // }, []);
    // // this.logger.info('updates.length', updates.length);
    // if (updates.length === 0) {
    //   this.logger.info('no updates for mana ocean');
    //   return;
    // }

    // this.executeOnModel({
    //   type: 'putLocationRecords',
    //   updates,
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  // getManaOptions(location: LocationRecord, tideHeight, neutralManaLevel, curTimestamp) {
  //   const { options } = location;
  //   const { effectList = [] } = options;
  //   const notOutdatedEffectList = effectList.filter((effect) => effect.permanent || effect.end > curTimestamp);
  //   const startedEffects = notOutdatedEffectList.filter((effect) => effect.start < curTimestamp);
  //   const groups = R.groupBy(R.prop('type'), startedEffects);

  //   let ids = [];
  //   if (groups.ritualLocation && groups.ritualNeighborLocation) {
  //     const compensatedEffectsSize = Math.min(groups.ritualLocation.length, groups.ritualNeighborLocation.length);
  //     ids = R.pluck('id', R.concat(
  //       groups.ritualLocation.slice(0, compensatedEffectsSize),
  //       groups.ritualNeighborLocation.slice(0, compensatedEffectsSize),
  //     ));
  //   }

  //   const liveEffectList = notOutdatedEffectList.filter((effect) => !ids.includes(effect.id));
  //   const startedEffects2 = startedEffects.filter((effect) => !ids.includes(effect.id));

  //   const effects = startedEffects2.map((effect) => ({
  //     type: effect.type,
  //     manaLevelChange: effect.manaLevelChange,
  //   }));
  //   if (effects.length > 0) {
  //     // this.logger.info('effects', location.id, effects);
  //   }
  //   const newOptions = {
  //     manaLevelModifiers: {
  //       neutralManaLevel,
  //       tideHeight,
  //       effects,
  //     },
  //     effectList: liveEffectList,
  //     manaLevel: null,
  //   };
  //   newOptions.manaLevel = this.calcManaLevel([neutralManaLevel, tideHeight, ...R.pluck('manaLevelChange', effects)]);
  //   if (!R.equals(options, newOptions)) {
  //     return newOptions;
  //   }
  //   return null;
  // }

  getNextTideHeight(curTimestamp: number, manaOceanSettings: ManaOceanSettingsData): number {
    if (this.prevTideHeight === null) {
      this.lastManaUpdateTimestamp = curTimestamp;
      // return -2;
      return 0;
    }
    const { moscowTimeInMinutes, moscowTime } = getMoscowTime();
    // speed up time, 1 second is 1 minute
    // moscowTimeInMinutes = (moscowTime.minute() * 60 + moscowTime.second()) % 1440;
    const tideHeight = getTideHeight2(moscowTimeInMinutes, manaOceanSettings);
    return tideHeight;

    // if (this.lastManaUpdateTimestamp + MANA_TIDE_UPDATE_INTERVAL > curTimestamp) {
    //   // this.logger.info('no mana update');
    //   return this.prevTideHeight;
    // }
    // // this.logger.info('update mana tide');
    // this.lastManaUpdateTimestamp = curTimestamp;
    // let tideHeight = this.prevTideHeight;
    // // if (counter % 2) {
    // tideHeight = this.prevTideHeight === 2 ? -2 : (this.prevTideHeight + 1);
    // // }
    // return tideHeight;
  }

  getSettings<T>(name: SettingsKeys): T {
    return this.getFromModel<any, T>({
      type: 'settings',
      name,
    });
  }

  calcManaLevel(arr: number[]): number {
    const manaOceanSettings: ManaOceanSettingsData = this.getSettings<ManaOceanSettingsData>('manaOcean');
    const sum: number = R.sum(arr);
    return R.max(R.min(manaOceanSettings.maxManaLevel, sum), manaOceanSettings.minManaLevel);
  }
}
