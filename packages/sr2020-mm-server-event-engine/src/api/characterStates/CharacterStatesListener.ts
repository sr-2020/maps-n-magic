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
  HealthChangeMessage,
  CharacterLifeStyle,
} from 'sr2020-mm-event-engine';

import { SingleGettable, SingleGettable2 } from '../types';
import { PubSubDataSource } from '../../dataManagers/types';

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: ['putCharHealthRequested'],
//   listenEvents: [],
//   needRequests: [],
//   needActions: []
// };

export class CharacterStatesListener extends AbstractEventProcessor {
  constructor(
    private characterLocationGetter: SingleGettable<RawUserRecord>,
    private lifeStyleGetter: SingleGettable2<CharacterLifeStyle>,
    protected pubSubDataSource: PubSubDataSource<HealthChangeMessage>,
    gameModel: GameModel, 
    logger: GMLogger
  ) {
    super(gameModel, logger);
    this.onMessageRecieved = this.onMessageRecieved.bind(this);
    this.pubSubDataSource.on('message', this.onMessageRecieved);
    this.setMetadata({
      emitEvents: ["putCharHealthRequested"]
    });
  }

  dispose() {
    this.pubSubDataSource.off('message', this.onMessageRecieved);
  }

  async onMessageRecieved(data: HealthChangeMessage) {
    // this.logger.info('CharacterStatesListener onMessageRecieved');
    const {
      characterId, stateFrom, stateTo, timestamp,
    } = data;
    const [{ locationId, locationLabel }, characterLifeStyle] = await Promise.all([
      this.getCharacterLocation(characterId),
      this.lifeStyleGetter.singleGet(characterId),
    ]);
    if (!this.lifeStyleGetter.validateEntity(characterLifeStyle)) {
      this.logger.error('characterLifeStyle is not valid: ' + 
        JSON.stringify(characterLifeStyle) + ", " + 
        JSON.stringify(this.lifeStyleGetter.validateEntity.errors)
      );
      return;
    }
    const { lifeStyle, personName } = characterLifeStyle;
    
    // this.logger.info('lifeStyle', lifeStyle, 'personName', personName);
    // this.logger.info(characterLifeStyle);
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
