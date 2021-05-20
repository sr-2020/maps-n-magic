import * as R from 'ramda';
import moment from 'moment-timezone';
import { 
  GameModel,
  PutCharLocationArgs,
  // PutCharLocation,
  EPutCharLocationRequested,
  AbstractEventProcessor,
  GMLogger
} from 'sr2020-mm-event-engine';
// import { getCharacterLocation } from './getCharacterLocation';
// import { getCharacterLifeStyle } from './getCharacterLifeStyle';
import { listenCharacterLocations } from './listenCharacterLocations';

// const { listenHealthChanges } = require('./listenHealthChanges');
// const { getCharacterLocation } = require('./getCharacterLocation');

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: [],
//   listenEvents: [],
//   needRequests: [],
//   needActions: ['putCharLocation']
// };

export class CharacterLocationListener extends AbstractEventProcessor {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenCharacterLocations(this.onMessageRecieved, true);
    this.setMetadata({
      emitEvents: ["putCharLocationRequested"]
    })
  }

  async onMessageRecieved(data: {
    id: number,
    locationId: number,
    prevLocationId: number
  }) {
    // console.log('onMessageRecieved');
    // const { characterId } = console.log(data);
    const {
      id, locationId, prevLocationId,
    } = data;
    // const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
    //   getCharacterLocation(characterId, true),
    //   getCharacterLifeStyle(characterId),
    // ]);
    // console.log('lifeStyle', lifeStyle, 'personName', personName);
    this.updateState(id, locationId, prevLocationId);
  }

  updateState(characterId: number, locationId: number, prevLocationId: number) {
    // console.log('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
    // this.gameModel.execute2<PutCharLocation>({
    //   type: 'putCharLocation',
    this.gameModel.emit2<EPutCharLocationRequested>({
      type: 'putCharLocationRequested',
      characterId,
      locationId,
      prevLocationId,
    });
  }
}