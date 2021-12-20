// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';

import { 
  GMLogger, 
  GameModel, 
  CharacterLocationData,
  UserRecord,
  RawUserRecord,
  EPostNotification,
  ESetAllCharacterLocations, 
  ESetCharacterLocation,
  AbstractEventProcessor,
  CharLocChangeMessage
} from "sr2020-mm-event-engine";

import { Gettable } from '../api/types';
import { PubSubDataSource } from './types';

// const metadata = {
//   actions: [],
//   requests: [],
//   emitEvents: ['postNotification', 'setCharacterLocation', 'setAllCharacterLocations'],
//   listenEvents: [],
//   needRequests: [],
//   needActions: []
// };

export class CharacterLocDataManager extends AbstractEventProcessor {
  logger: GMLogger;

  constructor(
    protected gameModel: GameModel, 
    protected userRecordProvider: Gettable<RawUserRecord>,
    protected pubSubDataSource: PubSubDataSource<CharLocChangeMessage>,
    logger: GMLogger,
  ) {
    super(gameModel, logger);
    let childLogger = logger;
    if (logger.customChild) {
      childLogger = logger.customChild(logger, { service: CharacterLocDataManager.name });
    }
    this.logger = childLogger;
    this.onMessage = this.onMessage.bind(this);
    this.setMetadata({
      emitEvents: ["setCharacterLocation", "setAllCharacterLocations",'postNotification']
    })
  }

  async init() {
    try {
      await this.load();
      this.pubSubDataSource.on('message', this.onMessage);
    } catch (err) {
      // @ts-ignore
      this.getErrorHandler('Unexpected error')(err);
    }
  }

  dispose() {
    this.pubSubDataSource.off('message', this.onMessage);
  }

  onMessage(data: CharLocChangeMessage) {
    // {
    //   "id": 51935,
    //   "locationId": 3212,
    //   "prevLocationId": 3217,
    //   "timestamp": 1606094156924
    // }
    // this.logger.info(data);

    this.gameModel.emit2<ESetCharacterLocation>({
      type: 'setCharacterLocation',
      characterId: data.id,
      locationId: data.locationId,
      prevLocationId: data.prevLocationId,
    });
  }

  async load() {
    const rawCharacterLocations = await this.userRecordProvider.get();
    const characterLocations: CharacterLocationData[] = rawCharacterLocations.map((item) => ({
      characterId: item.id,
      locationId: item.location_id,
      prevLocationId: null,
    }));
    // this.logger.info(characterLocations);
    this.gameModel.emit2<ESetAllCharacterLocations>({
      type: 'setAllCharacterLocations',
      characterLocations,
    });
  }

  getErrorHandler(title: string) {
    return (err: Error) => {
      this.logger.error(title, err);
      this.gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title,
        message: err.message || String(err),
        kind: 'error',
      });
    };
  }
}
