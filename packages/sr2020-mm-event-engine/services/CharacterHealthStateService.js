import * as R from 'ramda';

import { AbstractService } from '../core/AbstractService';

export class CharacterHealthStateService extends AbstractService {
  metadata = {
    actions: [
      'setCharacterHealthState',
      'setCharacterHealthStates',
    ],
    requests: [
      'characterHealthState', 'characterHealthStates',
    ],
    emitEvents: [
      'characterHealthStateChanged',
      'characterHealthStatesLoaded',
    ],
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

  setCharacterHealthState(action) {
    const { characterId, characterHealthState } = action;
    console.log('setCharacterHealthState', characterId, characterHealthState);
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    this.characterHealthStates[characterId] = characterHealthState;
    this.emit('characterHealthStateChanged', {
      ...action,
      type: 'characterHealthStateChanged',
      prevCharacterHealthState,
    });
    // console.log({ characterId, characterHealthState, prevCharacterHealthState });
  }

  setCharacterHealthStates({ characterHealthStates } = {}) {
    console.log('characterHealthStates', characterHealthStates);
    // this.characterHealthStates = characterHealthStates;
    // this.emit('characterHealthStatesLoaded', {
    //   type: 'characterHealthStatesLoaded'
    //   characterHealthStates
    // });
  }
}
