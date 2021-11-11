import * as R from 'ramda';
import { EventEmitter } from 'events';
// import { getCharacterModelData } from './api';
// import { createLogger } from './utils';
import { CharacterModelData, validateCharacterModelData } from 'sr2020-mm-event-engine';
import { createLogger } from 'sr2020-mm-server-event-engine';
import { getCharacterModelData } from './getCharacterModelData';

// const CHARACTER_UPDATE_INTERVAL_MILLIS = 60000;
// const CHARACTER_UPDATE_INTERVAL_MILLIS = 10000;
const CHARACTER_UPDATE_INTERVAL_MILLIS = 15000;
// const CHARACTER_UPDATE_INTERVAL_MILLIS = 60000;

interface CharacterCacheItem {
  lastUpdateTimestamp: number;
  data: CharacterModelData;
  sseListenerIds: Set<string>;
}

const logger = createLogger('characterWatcher.ts');

// TokenData
//   auth: "ROLE_CONFIG,ROLE_MASTER,ROLE_PLAYER"
// characterId: 736
// exp: 1668823421
// modelId: 51935
// sub: "51935"

export class CharacterWatcher extends EventEmitter {
  characterUpdateIntervalId: NodeJS.Timeout | null = null;

  characterCache: Record<number, CharacterCacheItem> = {};

  constructor() {
    super();
    this.updateCharacters = this.updateCharacters.bind(this);
  }

  start() {
    this.characterUpdateIntervalId = setInterval(
      () => this.updateCharacters(), 
      CHARACTER_UPDATE_INTERVAL_MILLIS
    ); 
  }

  updateCharacters() {
    // logger.info(`updateCharacters`);
    const keys = R.keys(this.characterCache);
    keys.filter(modelId => {
      return this.characterCache[modelId].sseListenerIds.size !== 0
    }).forEach(async (modelId) => {
      const data = await this.getCharacterModel(modelId);
      const { sseListenerIds } = this.characterCache[modelId];
      this.characterCache[modelId] = {
        lastUpdateTimestamp: Date.now(),
        data,
        sseListenerIds
      };
      this.emit(String(modelId), data);
    });
  }

  

  on2(listenerId: string, modelId: number, listener: (...args: any[]) => void): this {
    logger.info(`on listenerId ${listenerId} modelId ${modelId}`);
    this.characterCache[modelId].sseListenerIds.add(listenerId);
    super.on(String(modelId), listener);
    return this;
  }

  off2(listenerId: string, modelId: number, listener: (...args: any[]) => void): this {
    logger.info(`off listenerId ${listenerId} modelId ${modelId}`);
    this.characterCache[modelId].sseListenerIds.delete(listenerId);
    super.off(String(modelId), listener);
    return this;
  }

  async forceUpdateCharacterModel(modelId: number): Promise<CharacterModelData> {
    const now = Date.now();
    const data = await this.innerGetCharacterModel(modelId, now);
    const { sseListenerIds } = this.characterCache[modelId];
    this.characterCache[modelId] = {
      lastUpdateTimestamp: Date.now(),
      data,
      sseListenerIds
    };
    this.emit(String(modelId), data);
    return data;
  }

  public async getCharacterModel(modelId: number): Promise<CharacterModelData> {
    // logger.info(`getCharacterModel modelId ${modelId}`);
    const item: CharacterCacheItem | undefined = this.characterCache[modelId];
    const now = Date.now();
    if (item === undefined) {
      return this.innerGetCharacterModel(modelId, now);
    } else {
      if (now - item.lastUpdateTimestamp > CHARACTER_UPDATE_INTERVAL_MILLIS) {
        return this.innerGetCharacterModel(modelId, now);
      } else {
        return item.data;
      }
    }
  }
  
  async innerGetCharacterModel(modelId: number, now: number): Promise<CharacterModelData> {
    const data = await getCharacterModelData(modelId);
    if (!validateCharacterModelData(data)) {
      logger.warn(`model ${modelId} is not valid. Model ${JSON.stringify(data)}, errors ${JSON.stringify(validateCharacterModelData.errors)}`);
    } else {
      // logger.info(`model ${modelId} is valid`);
    }

    const prevItem: CharacterCacheItem | undefined = this.characterCache[modelId];
    this.characterCache[modelId] = {
      data,
      lastUpdateTimestamp: now,
      sseListenerIds: prevItem?.sseListenerIds || new Set()
    };
    return data;
  }

  dispose() {
    if (this.characterUpdateIntervalId !== null) {
      clearInterval(this.characterUpdateIntervalId);
    }
  }
}