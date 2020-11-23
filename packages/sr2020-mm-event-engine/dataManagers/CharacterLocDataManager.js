// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import { PubSub } from '@google-cloud/pubsub';

import { usersUrl } from '../api/constants';

let subscriptionName;

if (process.env.NODE_ENV === 'production') {
  subscriptionName = 'mm-char-loc-change-prod-2';
} else {
  subscriptionName = 'mm-char-loc-change-dev-2';
}

export class CharacterLocDataManager {
  constructor(gameModel, logger) {
    let childLogger = logger;
    if (logger.customChild) {
      childLogger = logger.customChild(logger, { service: CharacterLocDataManager.name });
    }
    this.logger = childLogger;
    this.gameModel = gameModel;
    this.messageCount = 0;
    this.messageHandler = this.messageHandler.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  async initialize() {
    try {
      this.pubSubClient = new PubSub();
      await this.load();
      this.logger.info('subscriptionName', subscriptionName);
      this.subscription = this.pubSubClient.subscription(subscriptionName);
      this.subscription.on('message', this.messageHandler);
    } catch (err) {
      this.getErrorHandler('Unexpected error')(err);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    this.subscription.off('message', this.messageHandler);
  }

  messageHandler(message) {
    const parsedData = JSON.parse(message.data);
    this.messageCount += 1;
    message.ack();

    // {
    //   "id": 51935,
    //   "locationId": 3212,
    //   "prevLocationId": 3217,
    //   "timestamp": 1606094156924
    // }
    this.logger.info(parsedData);

    this.gameModel.execute({
      type: 'setCharacterLocation',
      characterId: parsedData.id,
      locationId: parsedData.locationId,
      prevLocationId: parsedData.prevLocationId,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async load() {
    const rawCharacterLocations = await this.getCharacterLocations();

    const characterLocations = rawCharacterLocations.map((item) => ({
      characterId: item.id,
      locationId: item.location_id,
      prevLocationId: null,
    }));
    // this.logger.info(characterLocations);
    this.gameModel.execute({
      type: 'setAllCharacterLocations',
      characterLocations,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async getCharacterLocations() {
    const response = await fetch(usersUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': 1,
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

  getErrorHandler(title) {
    return (err) => {
      this.logger.error(title, err);
      this.gameModel.execute({
        type: 'postNotification',
        title,
        message: err.message || err,
        kind: 'error',
      });
    };
  }
}
