// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';
import fetch from 'isomorphic-fetch';
import { 
  GMLogger, 
  GameModel, 
  CharacterLocationData,
  UserRecord,
  EPostNotification,
  ESetAllCharacterLocations, 
  ESetCharacterLocation,
  AbstractEventProcessor
} from "sr2020-mm-event-engine";

import { usersUrl, charLocChange2SubscriptionName } from '../api/constants';

// import {  } from "../index";

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
  async getCharacterLocations(): Promise<UserRecord[]> {
    const response = await fetch(usersUrl, {
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
      throw new Error(`Network response was not ok ${text}`);
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
