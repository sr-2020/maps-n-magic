import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterHealthStateService extends AbstractService {
  metadata = {
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
    ],
    needRequests: ['locationRecord'],
    listenEvents: [],
  };

  constructor() {
    super();
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

  getCharacterHealthStates() {
    return R.clone(this.characterHealthStates);
  }

  getCharacterHealthState({ id }) {
    return R.clone(this.characterHealthStates[id]);
  }

  putCharHealth(action) {
    this.emit('putCharHealthRequested', action);
  }

  putCharLocation(action) {
    this.emit('putCharLocationRequested', action);
  }

  getLocation(locationId) {
    return this.getFromModel({
      type: 'locationRecord',
      id: locationId,
    });
  }

  putCharLocationConfirmed(action) {
    const { characterId, locationId } = action;
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    const locationRecord = this.getLocation(locationId);
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

  putCharHealthConfirmed(action) {
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

  setCharacterHealthStates({ characterHealthStates }) {
    // console.log('characterHealthStates', characterHealthStates);
    this.characterHealthStates = characterHealthStates;
    this.emit('characterHealthStatesLoaded', {
      type: 'characterHealthStatesLoaded',
      characterHealthStates,
    });
  }
}
