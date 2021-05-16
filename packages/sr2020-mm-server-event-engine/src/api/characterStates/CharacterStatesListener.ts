import * as R from 'ramda';
import moment from 'moment-timezone';
import { 
  GameModel, 
  RawCharacterHealthState, 
  // PutCharHealth,
  EPutCharHealthRequested,
  GMLogger,
  AbstractEventProcessor
} from 'sr2020-mm-event-engine';
import { getCharacterLocation } from './getCharacterLocation';
import { getCharacterLifeStyle } from './getCharacterLifeStyle';
import { listenHealthChanges } from './listenHealthChanges';

import { HealthChangeMessage } from "./listenHealthChanges";

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: [],
//   listenEvents: [],
//   needRequests: [],
//   needActions: ['putCharHealth']
// };

export class CharacterStatesListener extends AbstractEventProcessor {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenHealthChanges(this.onMessageRecieved, true);
    this.setMetadata({
      emitEvents: ["putCharHealthRequested"]
    })
  }

  async onMessageRecieved(data: HealthChangeMessage) {
    // console.log('onMessageRecieved');
    // const { characterId } = console.log(data);
    const {
      characterId, stateFrom, stateTo, timestamp,
    } = data;
    const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
      getCharacterLocation(characterId, true),
      getCharacterLifeStyle(characterId),
    ]);
    // console.log('lifeStyle', lifeStyle, 'personName', personName);
    this.updateState(characterId, {
      locationId,
      locationLabel,
      healthState: stateTo,
      timestamp,
      lifeStyle,
      personName,
    });
  }

  updateState(characterId: number, characterHealthState: RawCharacterHealthState) {
    // console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    // this.gameModel.execute2<PutCharHealth>({
    //   type: 'putCharHealth',
    this.gameModel.emit2<EPutCharHealthRequested>({
      type: 'putCharHealthRequested',
      characterId,
      characterHealthState,
    });

    // gameModel.execute({
    //   type: 'putCharHealth',
    //   characterId,
    //   characterHealthState: {
    //     locationId: getRandomEl(locations).id,
    //     healthState: getRandomEl(healthStates),
    //   },
    // });
    // putCharHealth({ characterId, characterHealthState })
    // characterStates[characterId] = {
    //   locationId,
    //   healthState,
    // };
  }
}
