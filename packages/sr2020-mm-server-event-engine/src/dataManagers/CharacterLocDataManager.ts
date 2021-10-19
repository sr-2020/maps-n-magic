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
  validateCharLocChangeMessage
} from "sr2020-mm-event-engine";

import { mainServerConstants, charLocChange2SubscriptionName } from '../api/constants';

import { PubSubWrapper } from "./PubSubWrapper";
import { Gettable } from '../api/types';

const metadata = {
  actions: [],
  requests: [],
  emitEvents: ['postNotification'],
  listenEvents: [],
  needRequests: [],
  needActions: ['setCharacterLocation', 'setAllCharacterLocations']
};

export class CharacterLocDataManager extends AbstractEventProcessor {
  logger: GMLogger;

  pubSubWrapper: PubSubWrapper | null = null;

  constructor(
    protected gameModel: GameModel, 
    protected userRecordProvider: Gettable<RawUserRecord>,
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
      emitEvents: ["setCharacterLocation", "setAllCharacterLocations"]
    })
  }

  async init() {
    try {
      await this.load();
      this.pubSubWrapper = PubSubWrapper.makePubSubWrapper(
        charLocChange2SubscriptionName,
        this.logger,
        this.onMessage
      );
    } catch (err) {
      this.getErrorHandler('Unexpected error')(err);
    }
  }

  dispose() {
    if (this.pubSubWrapper !== null) {
      this.pubSubWrapper.dispose();
    }
  }

  onMessage(data: unknown) {
    if (!validateCharLocChangeMessage(data)) {
      this.logger.error(`Received invalid CharLocChangeMessage. ${JSON.stringify(data)} ${JSON.stringify(validateCharLocChangeMessage.errors)}`);
      return;
    // } else {
    //   this.logger.info('CharLocChangeMessage validation OK');
    }

    // {
    //   "id": 51935,
    //   "locationId": 3212,
    //   "prevLocationId": 3217,
    //   "timestamp": 1606094156924
    // }
    this.logger.info(data);

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
