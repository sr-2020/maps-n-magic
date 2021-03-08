import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger 
} from '../core';

import { 
  CharacterHealthStates, 
  RawCharacterHealthState,
  LocationRecord
} from "../types";


const metadata: Metadata = {
  actions: [
    'putCharHealth',
    'putCharHealthConfirmed',
    'putCharLocation',
    'putCharLocationConfirmed',
    'setCharacterHealthStates',
  ],
  requests: [
    'characterHealthState', 'characterHealthStates',
  ],
  emitEvents: [
    'putCharHealthRequested',
    'putCharLocationRequested',
    'characterHealthStateChanged',
    'characterHealthStatesLoaded',
    'putCharLocationConfirmed',
  ],
  listenEvents: [],
  needRequests: ['locationRecord'],
  needActions: [],
};

export class CharacterHealthStateService extends AbstractService {
  characterHealthStates: CharacterHealthStates;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
    // {
    //   "51935": {
    //     "locationId": 3217,
    //     "locationLabel": "Мастерка",
    //     "healthState": "healthy",
    //     "timestamp": 1606410304241,
    //     "lifeStyle": "Wood",
    //     "personName": "Новый персонаж в группе Мастера и приложение !!!(Без страховки)!!!"
    //   }
    // }
    this.characterHealthStates = {};
  }

  // this is a virtual service without real persistence
  // eslint-disable-next-line class-methods-use-this
  setData() {
  }

  // eslint-disable-next-line class-methods-use-this
  getData() {
    return {};
  }

  getCharacterHealthStates(): CharacterHealthStates {
    return R.clone(this.characterHealthStates);
  }

  getCharacterHealthState({ id }: { id:number }): RawCharacterHealthState {
    return R.clone(this.characterHealthStates[id]);
  }

  putCharHealth(action: unknown) {
    this.emit('putCharHealthRequested', action);
  }

  putCharLocation(action: unknown) {
    // this.logger.info('putCharLocationRequested', action);
    this.emit('putCharLocationRequested', action);
  }

  getLocation(locationId: number): LocationRecord {
    return this.getFromModel<any, LocationRecord>({
      type: 'locationRecord',
      id: locationId,
    });
  }

  putCharLocationConfirmed(action: { 
    characterId: number, 
    locationId: number 
  } ): void {
    const { characterId, locationId } = action;
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    const locationRecord = this.getLocation(locationId);
    // this.logger.info('putCharLocationConfirmed', action);
    this.emit('putCharLocationConfirmed', {
      ...action,
      type: 'putCharLocationConfirmed',
    });
    if (!prevCharacterHealthState || !locationRecord) {
      return;
    }
    const characterHealthState = {
      ...prevCharacterHealthState,
      locationId,
      locationLabel: locationRecord.label,
    };
    this.characterHealthStates = {
      ...this.characterHealthStates,
      [characterId]: characterHealthState,
    };
    this.emit('characterHealthStateChanged', {
      characterId,
      characterHealthState,
      type: 'characterHealthStateChanged',
      prevCharacterHealthState,
    });
    this.emit('characterHealthStatesLoaded', {
      type: 'characterHealthStatesLoaded',
      characterHealthStates: this.characterHealthStates,
    });
  }

  putCharHealthConfirmed(action: { 
    characterId: number, 
    characterHealthState: RawCharacterHealthState 
  }): void {
    const { characterId, characterHealthState } = action;
    // console.log('putCharHealthConfirmed', characterId, characterHealthState);
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    // this.characterHealthStates[characterId] = characterHealthState;
    this.characterHealthStates = {
      ...this.characterHealthStates,
      [characterId]: characterHealthState,
    };
    this.emit('characterHealthStateChanged', {
      ...action,
      type: 'characterHealthStateChanged',
      prevCharacterHealthState,
    });
    this.emit('characterHealthStatesLoaded', {
      type: 'characterHealthStatesLoaded',
      characterHealthStates: this.characterHealthStates,
    });
    // console.log({ characterId, characterHealthState, prevCharacterHealthState });
  }

  setCharacterHealthStates({ characterHealthStates }: {
    characterHealthStates: CharacterHealthStates
  }): void {
    // console.log('characterHealthStates', characterHealthStates);
    this.characterHealthStates = characterHealthStates;
    this.emit('characterHealthStatesLoaded', {
      type: 'characterHealthStatesLoaded',
      characterHealthStates,
    });
  }
}
