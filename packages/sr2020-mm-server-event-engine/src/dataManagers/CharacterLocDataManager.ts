// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';
import Ajv, { JSONSchemaType } from "ajv";

import fetch from 'isomorphic-fetch';
import { 
  GMLogger, 
  GameModel, 
  CharacterLocationData,
  UserRecord,
  RawUserRecord,
  EPostNotification,
  ESetAllCharacterLocations, 
  ESetCharacterLocation,
  AbstractEventProcessor
} from "sr2020-mm-event-engine";

import { urls, charLocChange2SubscriptionName } from '../api/constants';


const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// {
//   "id": 51935,
//   "locationId": 3212,
//   "prevLocationId": 3217,
//   "timestamp": 1606094156924
// }

interface CharLocChangeMessage {
  id: number;
  locationId: number | null;
  prevLocationId: number | null;
  timestamp: number;
}

const charLocChangeMessageSchema: JSONSchemaType<CharLocChangeMessage> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    locationId: {type: "integer", nullable: true},
    prevLocationId: {type: "integer", nullable: true},
    timestamp: {type: "integer"}
  },
  required: ["id", "locationId", "prevLocationId", "timestamp"],
  // additionalProperties: false,
};

export const validateCharLocChangeMessage = ajv.compile(charLocChangeMessageSchema);

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

  messageCount: number;

  pubSubClient: PubSub | null = null;

  subscription: Subscription | null = null;

  constructor(protected gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    let childLogger = logger;
    if (logger.customChild) {
      childLogger = logger.customChild(logger, { service: CharacterLocDataManager.name });
    }
    this.logger = childLogger;
    this.messageCount = 0;
    this.messageHandler = this.messageHandler.bind(this);
    this.setMetadata({
      emitEvents: ["setCharacterLocation", "setAllCharacterLocations"]
    })
  }

  async init() {
    try {
      this.pubSubClient = new PubSub();
      await this.load();
      // this.logger.info('charLocChange2SubscriptionName', charLocChange2SubscriptionName);
      this.subscription = this.pubSubClient.subscription(charLocChange2SubscriptionName);
      this.subscription.on('message', this.messageHandler);
      this.subscription.on('error', error => {
        console.error('listenHealthChanges received error:', error);
        process.exit(1);
      });
    } catch (err) {
      this.getErrorHandler('Unexpected error')(err);
    }
  }

  dispose() {
    if (this.subscription !== null) {
      this.subscription.off('message', this.messageHandler);
    }
  }

  messageHandler(message: Message) {
    const parsedData = JSON.parse(message.data.toString());
    this.messageCount += 1;
    message.ack();

    if (!validateCharLocChangeMessage(parsedData)) {
      this.logger.error(`Received invalid CharLocChangeMessage. ${JSON.stringify(parsedData)} ${JSON.stringify(validateCharLocChangeMessage.errors)}`);
    // } else {
    //   this.logger.info('CharLocChangeMessage validation OK');
    }

    // {
    //   "id": 51935,
    //   "locationId": 3212,
    //   "prevLocationId": 3217,
    //   "timestamp": 1606094156924
    // }
    this.logger.info(parsedData);

    this.gameModel.emit2<ESetCharacterLocation>({
      type: 'setCharacterLocation',
      characterId: parsedData.id,
      locationId: parsedData.locationId,
      prevLocationId: parsedData.prevLocationId,
    });
  }

  async load() {
    const rawCharacterLocations = await this.getCharacterLocations();

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

  // eslint-disable-next-line class-methods-use-this
  async getCharacterLocations(): Promise<RawUserRecord[]> {
    const response = await fetch(urls().usersUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': "1",
      },
    });

    // testing error processing
    // if (true === true) {
    //   throw new Error(`Network response was not ok ${345}`);
    // }

    if (!response.ok) {
      const text = await response.text();
      // throw new Error(`Network response was not ok ${text}`);
      throw new Error(`getCharacterLocations network response was not ok ${response.ok} ${response.statusText}`);
    }

    return response.json();
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
