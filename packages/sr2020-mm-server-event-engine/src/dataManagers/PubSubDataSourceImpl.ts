// import { PubSub, Message } from '@google-cloud/pubsub';
import EventEmitter from 'events';
import { GMLogger } from 'sr2020-mm-event-engine';
import { validateEntityFunction } from '../api/types';
import { createLogger } from '../utils';
import { PubSubDataSource } from './types';

export class PubSubDataSourceImpl<MessageType> 
  extends EventEmitter 
  implements PubSubDataSource<MessageType>
{
  // pubSubClient: PubSub;
  logger: GMLogger;
  messageCount: number = 0

  constructor(
    public subscriptionName: string,
    public validateMessage: validateEntityFunction<MessageType>
  ) {
    super();
    // this.pubSubClient = new PubSub();
    this.logger = createLogger(`pubsub:${subscriptionName}`);
  }

  on(event: 'message', listener: (data: MessageType) => void): this {
    super.on(event, listener);
    return this;
  }

  start(): void {
    // this.logger.info(`Starting pubsub subscription`);
    // // References an existing subscription
    // const subscription = this.pubSubClient.subscription(this.subscriptionName);
  
    // // Create an event handler to handle messages
    // // let messageCount = 0;
    // const messageHandler = (message: Message) => {
    //   // logger.info(`Received message ${message.id}:`);
    //   // logger.info(`\tData: ${message.data}`);
    //   const parsedData: MessageType = JSON.parse(message.data.toString());
    //   // logger.info(`Data: ${JSON.stringify(parsedData, null, '  ')}`);
    //   // logger.info(`\tAttributes: ${message.attributes}`);
    //   this.messageCount += 1;
    //   // logger.info(`listenHealthChanges data: ${JSON.stringify(parsedData, null, '  ')}`);
  
    //   if (!this.validateMessage(parsedData)) {
    //     this.logger.error(`Received invalid message. ${JSON.stringify(parsedData)} ${JSON.stringify(this.validateMessage.errors)}`);
    //   } else {
    //     this.logger.info('Validation OK');
    //   }
    //   // logger.info(`listenHealthChanges validation OK ${JSON.stringify(parsedData)}`);
  
    //   // listenHealthChanges data: {
    //   //   "characterId": 51935,
    //   //   "characterName": "Новый персонаж в группе Мастера и приложение",
    //   //   "stateFrom": "clinically_dead",
    //   //   "stateTo": "healthy",
    //   //   "timestamp": 1606017590767
    //   // }
  
    //   // "Ack" (acknowledge receipt of) the message
    //   message.ack();
    //   this.emit('message', parsedData);
    //   // this.logger.info(JSON.stringify(parsedData));
    //   // callback(parsedData);
    // };
  
    // // Listen for new messages until timeout is hit
    // subscription.on('message', messageHandler);
  
    // subscription.on('error', error => {
    //   this.logger.error('Received error:', error);
    //   // process.exit(1);
    // });
  }
}