import * as R from 'ramda';
import moment from 'moment-timezone';
import { 
  GameModel, 
  RawCharacterHealthState, 
  // PutCharHealth,
  EPutCharHealthRequested,
  GMLogger,
  AbstractEventProcessor,
  RawUserRecord,
  HealthChangeMessage
} from 'sr2020-mm-event-engine';
// import { getCharacterLocation } from './getCharacterLocation';
import { getCharacterLifeStyle } from './getCharacterLifeStyle';
import { listenHealthChanges } from './listenHealthChanges';

import { SingleGettable } from '../types';

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: [],
//   listenEvents: [],
//   needRequests: [],
//   needActions: ['putCharHealth']
// };

export class CharacterStatesListener extends AbstractEventProcessor {
  constructor(
    private characterLocationGetter: SingleGettable<RawUserRecord>,
    gameModel: GameModel, 
    logger: GMLogger
  ) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    listenHealthChanges(this.onMessageRecieved, true);
    this.setMetadata({
      emitEvents: ["putCharHealthRequested"]
    });
  }

  async onMessageRecieved(data: HealthChangeMessage) {
    // this.logger.info('CharacterStatesListener onMessageRecieved');
    const {
      characterId, stateFrom, stateTo, timestamp,
    } = data;
    const [{ locationId, locationLabel }, { lifeStyle, personName }] = await Promise.all([
      // getCharacterLocation(characterId, true),
      this.getCharacterLocation(characterId),
      getCharacterLifeStyle(characterId),
    ]);
    // this.logger.info('lifeStyle', lifeStyle, 'personName', personName);
    this.updateState(characterId, {
      locationId,
      locationLabel,
      healthState: stateTo,
      timestamp,
      lifeStyle,
      personName,
    });
  }

  async getCharacterLocation(characterId: number): Promise<{
    locationId: number | null,
    locationLabel: string
  }>  {
    const result = await this.characterLocationGetter.singleGet({ id: characterId });

    if (result == undefined || R.isNil(result.location_id)) {
      return {
        locationId: null,
        locationLabel: 'N/A',
      };
    }
  
    return {
      locationId: result.location_id,
      locationLabel: result.location?.label || 'N/A',
    };
  }

  updateState(characterId: number, characterHealthState: RawCharacterHealthState) {
    // this.logger.info('received timestamp', timestamp, ', cur moment().utc()', moment.utc().valueOf());
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
