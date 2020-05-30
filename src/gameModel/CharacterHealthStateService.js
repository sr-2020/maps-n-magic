import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class CharacterHealthStateService extends AbstractService {
  metadata = {
    actions: [
      'setCharacterHealthState',
    ],
    requests: [
      'characterHealthState', 'characterHealthStates',
    ],
    emitEvents: [
      'characterHealthStateChanged',
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

  setCharacterHealthState({ characterId, characterHealthState }) {
    const prevCharacterHealthState = this.characterHealthStates[characterId];
    this.characterHealthStates[characterId] = characterHealthState;
    this.emit('characterHealthStateChanged', { characterId, characterHealthState, prevCharacterHealthState });
    // console.log({ characterId, characterHealthState, prevCharacterHealthState });
  }
}
