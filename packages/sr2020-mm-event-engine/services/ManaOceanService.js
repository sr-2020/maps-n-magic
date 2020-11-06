// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import shortid from 'shortid';
import moment from 'moment-timezone';
// const shortid = require('shortid');

import { AbstractService } from '../core/AbstractService';

import { getMoscowTime, getTideHeight2 } from '../utils/moonActivityUtils';
import { isGeoLocation } from '../utils';

// const defaultManaOceanSettings = {
//   neutralManaLevel: 3,
//   visibleMoonPeriod: 180, // minutes
//   visibleMoonNewMoonTime: 0,
//   visibleMoonManaTideHeight: 1,
//   invisibleMoonPeriod: 270,
//   invisibleMoonNewMoonTime: 120,
//   invisibleMoonManaTideHeight: 1,
//   moscowTime: 0,
// };
const TIDE_LEVEL_UPDATE_INTERVAL = 5000; // millis

// const MANA_TIDE_UPDATE_INTERVAL = 10000; // millis
// const MANA_TIDE_UPDATE_INTERVAL = 30000; // millis
const MANA_TIDE_UPDATE_INTERVAL = 60000 * 10; // millis

// let counter = 1;

class EffectCollector {
  index = {};

  addEffect(locationRecord, effect) {
    const { id } = locationRecord;
    let record = this.index[id];
    if (!record) {
      record = {
        locationRecord,
        effects: [],
      };
      this.index[id] = record;
    }
    record.effects.push(effect);
  }

  toLocationUpdates() {
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

export class ManaOceanService extends AbstractService {
  metadata = {
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
    needActions: ['putLocationRecord', 'putLocationRecords'],
    needRequests: ['manaOceanSettings', 'locationRecords', 'locationRecord', 'enableManaOcean', 'neighborOrRandomLocation'],
    listenEvents: ['massacreTriggered'],
  };

  constructor() {
    super();
    this.prevTideHeight = null;
    this.tideLevelTimerId = null;
    // this.manaModifiers = [];
    this.onTideLevelUpdate = this.onTideLevelUpdate.bind(this);
    this.onMassacreTriggered = this.onMassacreTriggered.bind(this);
    this.getManaOptions = this.getManaOptions.bind(this);
    // this.manaOceanSettings = R.clone(defaultManaOceanSettings);
  }

  init(gameModel) {
    super.init(gameModel);
    if (this.tideLevelTimerId === null) {
      this.tideLevelTimerId = setInterval(this.onTideLevelUpdate, TIDE_LEVEL_UPDATE_INTERVAL);
    } else {
      console.error('tideLevelTimer already initialized');
    }
    this.on('massacreTriggered', this.onMassacreTriggered);
    // this.gameModel = gameModel;
  }

  dispose() {
    if (this.tideLevelTimerId !== null) {
      clearInterval(this.tideLevelTimerId);
    }
    this.off('massacreTriggered', this.onMassacreTriggered);
  }

  spellCast(data) {
    console.log('spellCast', data);

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
    const locationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      console.error('location not found', locationId);
      return;
    }
    const effectCollector = new EffectCollector();
    this.processPowerSpell(data, effectCollector);
    this.processRitualCast(data, effectCollector);
    this.processManaOceanSpells(data, effectCollector);
    const updates = effectCollector.toLocationUpdates();
    if (updates.length > 0) {
      this.pushEffects(updates);
    }
    // console.log('effectCollector', JSON.stringify(effectCollector.index, null, '  '));
  }

  processManaOceanSpells(data, effectCollector) {
    const { id, power, timestamp } = data;

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

    const startTime = timestamp;
    const endTime = startTime + power * 3 * 60000;
    const probability = Math.min(1, power * 0.2);
    let range = R.range(1, power * 3);
    if (probability < 1) {
      range = range.filter(() => Math.random() < probability);
    }

    const locationId = data.location.id;
    const locationRecord = this.getLocation(locationId);
    // console.log('dssd');

    range.forEach((el) => {
      const neighborLocation = this.getFromModel({
        type: 'neighborOrRandomLocation',
        locationId: locationRecord.id,
      });
      if (neighborLocation == null) {
        return;
      }
      effectCollector.addEffect(locationRecord, {
        type: id === 'input-stream' ? 'inputStreamStart' : 'outputStreamStart',
        id: shortid.generate(),
        start: startTime + el * 60000,
        end: endTime,
        // start: timestamp + 15000, // start after 15 seconds
        // end: timestamp + 30000, // end after 30 seconds
        // end: timestamp + 120000, // end after 30 seconds
        manaLevelChange: id === 'input-stream' ? 1 : -1,
      });
      effectCollector.addEffect(neighborLocation, {
        type: id === 'input-stream' ? 'inputStreamNeighbor' : 'outputStreamNeighbor',
        id: shortid.generate(),
        start: startTime + el * 60000,
        end: endTime,
        // start: timestamp + 15000, // start after 15 seconds
        // end: timestamp + 30000, // end after 30 seconds
        // end: timestamp + 120000, // end after 30 seconds
        manaLevelChange: id === 'input-stream' ? -1 : 1,
      });
    });
    // console.log({
    //   startTime,
    //   endTime,
    //   range,
    // });
  }

  processRitualCast(data, effectCollector) {
    const { timestamp, ritualMembersIds, ritualVictimIds } = data;
    if (ritualMembersIds.length + ritualVictimIds.length < 2) {
      return;
    }
    const locationId = data.location.id;
    const locationRecord = this.getLocation(locationId);
    // console.log('dssd');
    const neighborLocation = this.getFromModel({
      type: 'neighborOrRandomLocation',
      locationId: locationRecord.id,
    });
    if (neighborLocation == null) {
      return;
    }
    console.log({ neighborLocation });

    effectCollector.addEffect(locationRecord, {
      type: 'ritualLocation',
      id: shortid.generate(),
      start: timestamp + 60000 * 15, // start after 15 minutes
      // end: timestamp + 60000 * 30, // end after 30 minutes
      // start: timestamp + 15000, // start after 15 seconds
      // end: timestamp + 30000, // end after 30 seconds
      // end: timestamp + 120000, // end after 30 seconds
      manaLevelChange: -1,
      permanent: true,
    });
    effectCollector.addEffect(neighborLocation, {
      type: 'ritualNeighborLocation',
      id: shortid.generate(),
      start: timestamp + 60000 * 15, // start after 15 minutes
      // end: timestamp + 60000 * 30, // end after 30 minutes
      // start: timestamp + 15000, // start after 15 seconds
      // end: timestamp + 30000, // end after 30 seconds
      // end: timestamp + 120000, // end after 30 seconds
      manaLevelChange: 1,
      permanent: true,
    });
  }

  processPowerSpell(data, effectCollector) {
    const { timestamp, power } = data;
    if (power < 7) {
      return;
    }
    const locationId = data.location.id;
    const locationRecord = this.getLocation(locationId);
    effectCollector.addEffect(locationRecord, {
      type: 'powerSpell',
      id: shortid.generate(),
      start: timestamp + 60000 * 15, // start after 15 minutes
      end: timestamp + 60000 * 30, // end after 30 minutes
      // start: timestamp + 15000, // start after 15 seconds
      // end: timestamp + 30000, // end after 30 seconds
      // end: timestamp + 120000, // end after 30 seconds
      manaLevelChange: -1,
    });
  }

  onMassacreTriggered(data) {
    const { locationId, timestamp } = data;
    // {
    //   type: 'massacreTriggered',
    //   locationId: 3061,
    //   timestamp: 1602203600686
    // }
    // this.manaModifiers.push(data);
    const locationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      console.error('location not found', locationId);
      return;
    }
    this.pushEffect(locationRecord, {
      type: 'massacre',
      id: shortid.generate(),
      start: timestamp + 60000 * 15, // start after 15 minutes
      end: timestamp + 60000 * 45, // end after 30 minutes
      // start: timestamp + 15000, // start after 15 seconds
      // end: timestamp + 30000, // end after 30 seconds
      // end: timestamp + 120000, // end after 30 seconds
      manaLevelChange: 1,
    });
    // // console.log('manaModifiers', this.manaModifiers, shortid.generate(), data, locationRecord);
  }

  getLocation(locationId) {
    return this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
  }

  pushEffect(locationRecord, effect) {
    const { effectList = [] } = locationRecord.options;
    // effectList = [];
    effectList.push(effect);
    console.log('pushEffect', locationRecord.id, locationRecord.label, effect.type);
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

  pushEffects(updates) {
    console.log('pushEffects', updates);
    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
  }

  addManaEffect(data) {
    // console.log('addManaEffect', data);
    const { locationId, effectType } = data;
    const locationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      console.error('location not found', locationId);
      return;
    }
    if (effectType !== 'massacre' && effectType !== 'powerSpell') {
      return;
    }

    // const { moscowTime } = getMoscowTime();
    // const timestamp = moscowTime.utc().valueOf();
    const timestamp = moment.utc().valueOf();
    let effect;
    if (effectType === 'massacre') {
      effect = {
        type: 'massacre',
        id: shortid.generate(),
        start: timestamp, // start after 15 minutes
        end: timestamp + 60000 * 30, // end after 30 minutes
        // start: timestamp + 15000, // start after 15 seconds
        // end: timestamp + 30000, // end after 30 seconds
        // end: timestamp + 120000, // end after 30 seconds
        manaLevelChange: 1,
      };
    }
    if (effectType === 'powerSpell') {
      effect = {
        type: 'powerSpell',
        id: shortid.generate(),
        start: timestamp, // start after 15 minutes
        end: timestamp + 60000 * 15, // end after 30 minutes
        // start: timestamp + 15000, // start after 15 seconds
        // end: timestamp + 30000, // end after 30 seconds
        // end: timestamp + 120000, // end after 30 seconds
        manaLevelChange: -1,
      };
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

  removeManaEffect(data) {
    const { locationId, effectId } = data;
    const locationRecord = this.getLocation(locationId);
    if (!locationRecord) {
      console.error('location not found', locationId);
      return;
    }

    const { options } = locationRecord;
    const newEffectList = options.effectList.filter((el) => el.id !== effectId);
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

    // console.log('removeManaEffect', data);
  }

  wipeManaOceanEffects() {
    // console.log('wipeManaOceanEffects');
    const manaOceanSettings = this.getFromModel('manaOceanSettings');
    const locationRecords = this.getFromModel('locationRecords');
    const { neutralManaLevel } = manaOceanSettings;
    const geoLocations = locationRecords.filter(isGeoLocation);
    const curTimestamp = moment.utc().valueOf();

    const tideHeight = this.getNextTideHeight(curTimestamp);

    this.prevTideHeight = tideHeight;

    const updates = geoLocations.reduce((acc, location) => {
      const newOptions = {
        manaLevelModifiers: {
          neutralManaLevel,
          tideHeight,
          effects: [],
        },
        effectList: [],
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
    }, []);

    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
  }

  onTideLevelUpdate() {
    const enableManaOcean = this.getFromModel('enableManaOcean');
    if (!enableManaOcean) {
      return;
    }
    // counter++;
    const curTimestamp = moment.utc().valueOf();

    const manaOceanSettings = this.getFromModel('manaOceanSettings');
    const locationRecords = this.getFromModel('locationRecords');
    const { neutralManaLevel } = manaOceanSettings;

    const geoLocations = locationRecords.filter(isGeoLocation);

    // const geoLocationIndex = R.indexBy(R.prop('id'), geoLocations);

    // const firstLocation = locationRecords.find(isGeoLocation);
    // if (!firstLocation) {
    //   return;
    // }

    let { moscowTimeInMinutes, moscowTime } = getMoscowTime();
    // speed up time, 1 second is 1 minute
    moscowTimeInMinutes = (moscowTime.minute() * 60 + moscowTime.second()) % 1440;
    // const tideHeight = getTideHeight2(moscowTimeInMinutes, manaOceanSettings);

    // if (this.prevTideHeight === tideHeight) {
    //   console.log('Tide height not changed, skip mana level update');
    //   return;
    // }
    const tideHeight = this.getNextTideHeight(curTimestamp);

    this.prevTideHeight = tideHeight;

    // console.log('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight, firstLocation);
    console.log('onTideLevelUpdate', 'moscowTimeInMinutes', moscowTimeInMinutes, 'tideHeight', tideHeight);

    const updates = geoLocations.reduce((acc, location) => {
      const newOptions = this.getManaOptions(location, tideHeight, neutralManaLevel, curTimestamp);
      if (!R.isNil(newOptions)) {
        acc.push({
          id: location.id,
          body: {
            options: newOptions,
          },
        });
      }
      return acc;
    }, []);
    console.log('updates.length', updates.length);
    if (updates.length === 0) {
      console.log('no updates for mana ocean');
      return;
    }

    this.executeOnModel({
      type: 'putLocationRecords',
      updates,
    });
    // this.executeOnModel({
    //   type: 'putLocationRecord',
    //   id: firstLocation.id,
    //   props: {
    //     options: {
    //       ...firstLocation.options,
    //       manaLevel: this.calcManaLevel([neutralManaLevel, tideHeight]),
    //       manaLevelModifiers: {
    //         neutralManaLevel,
    //         tideHeight,
    //       },
    //     },
    //   },
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  getManaOptions(location, tideHeight, neutralManaLevel, curTimestamp) {
    const { options } = location;
    const { effectList = [] } = options;
    const notOutdatedEffectList = effectList.filter((effect) => effect.permanent || effect.end > curTimestamp);
    const startedEffects = notOutdatedEffectList.filter((effect) => effect.start < curTimestamp);
    const groups = R.groupBy(R.prop('type'), startedEffects);

    let ids = [];
    if (groups.ritualLocation && groups.ritualNeighborLocation) {
      const compensatedEffectsSize = Math.min(groups.ritualLocation.length, groups.ritualNeighborLocation.length);
      ids = R.pluck('id', R.concat(
        groups.ritualLocation.slice(0, compensatedEffectsSize),
        groups.ritualNeighborLocation.slice(0, compensatedEffectsSize),
      ));
    }

    const liveEffectList = notOutdatedEffectList.filter((effect) => !ids.includes(effect.id));
    const startedEffects2 = startedEffects.filter((effect) => !ids.includes(effect.id));

    const effects = startedEffects2.map((effect) => ({
      type: effect.type,
      manaLevelChange: effect.manaLevelChange,
    }));
    if (effects.length > 0) {
      // console.log('effects', location.id, effects);
    }
    const newOptions = {
      manaLevelModifiers: {
        neutralManaLevel,
        tideHeight,
        effects,
      },
      effectList: liveEffectList,
    };
    newOptions.manaLevel = this.calcManaLevel([neutralManaLevel, tideHeight, ...R.pluck('manaLevelChange', effects)]);
    if (!R.equals(options, newOptions)) {
      return newOptions;
    }
    return null;
  }

  getNextTideHeight(curTimestamp) {
    if (this.prevTideHeight === null) {
      this.lastManaUpdateTimestamp = curTimestamp;
      // return -2;
      return 0;
    }
    if (this.lastManaUpdateTimestamp + MANA_TIDE_UPDATE_INTERVAL > curTimestamp) {
      // console.log('no mana update');
      return this.prevTideHeight;
    }
    // console.log('update mana tide');
    this.lastManaUpdateTimestamp = curTimestamp;
    let tideHeight = this.prevTideHeight;
    // if (counter % 2) {
    tideHeight = this.prevTideHeight === 3 ? -3 : (this.prevTideHeight + 1);
    // }
    return tideHeight;
  }

  calcManaLevel(arr) {
    const manaOceanSettings = this.getFromModel('manaOceanSettings');
    const sum = R.sum(arr);
    return R.max(R.min(manaOceanSettings.maxManaLevel, sum), manaOceanSettings.minManaLevel);
  }
}
