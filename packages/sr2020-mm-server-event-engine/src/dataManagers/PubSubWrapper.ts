import * as R from 'ramda';
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';

import { 
  GMLogger, 
} from "sr2020-mm-event-engine";

export class PubSubWrapper {
  pubSubClient: PubSub | null = null;

  subscription: Subscription | null = null;

  public static makePubSubWrapper(
    subscriptionName: string,
    logger: GMLogger,
    onMessage: (data: unknown) => void,
    onError?: (error: unknown) => void,
  ) {
    logger.info(`Starting pubsub ${subscriptionName}`);
    let messageCount = 0;
    const pubSubClient = new PubSub();
    const subscription = pubSubClient.subscription(subscriptionName);

    const messageHandler = function (message: Message) {
      const parsedData = JSON.parse(message.data.toString());
      // this.messageCount += 1;
      message.ack();
      onMessage(parsedData);
    }

    const onError2 = onError || ((error) => {
      logger.error(`pubsub ${subscriptionName} received error:`, error);
      // process.exit(1);
    });

    subscription.on('message', messageHandler);
    subscription.on('error', onError2);
    
    function onDispose() {
      subscription.off('message', messageHandler);
      subscription.off('error', onError2);
    }

    return new PubSubWrapper(onDispose);
  }

  private constructor(
    private onDispose: () => void
  ) {}

  dispose() {
    this.onDispose();
  }
}