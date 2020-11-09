// Imports the Google Cloud client library
// const { PubSub } = require('@google-cloud/pubsub');
import { PubSub } from '@google-cloud/pubsub';
import moment from 'moment-timezone';
import { bodyConditions } from 'sr2020-mm-data/gameConstants';
import { randomInteger } from '../../utils';

let subscriptionName;

if (process.env.NODE_ENV === 'production') {
  subscriptionName = 'rescue-service';
} else {
  subscriptionName = 'rescue-service-dev';
}
console.log('subscriptionName', subscriptionName);
const timeout = 60;

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

export function listenHealthChanges(callback, simulateMessages = false) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    // console.log(`Received message ${message.id}:`);
    // console.log(`\tData: ${message.data}`);
    const parsedData = JSON.parse(message.data);
    // console.log(`Data: ${JSON.stringify(parsedData, null, '  ')}`);
    // console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();
    callback(parsedData);
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  if (simulateMessages) {
    let flag = true;
    // const charList = [10198, 9504, 9542, 10199, 10200, 10201, 51935];
    const charList = [51935];
    // charList.forEach((characterId) => {
    // });
    setInterval(() => {
      const characterId = charList[randomInteger(0, charList.length - 1)];
      callback({
        characterId,
        stateFrom: 'healthy',
        stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
        // stateTo: 'clinically_dead',
        // stateFrom: flag ? 'clinically_dead' : 'healthy',
        // stateTo: !flag ? 'clinically_dead' : 'healthy',
        timestamp: moment.utc().valueOf(),
      });
      flag = !flag;
    // }, 3000);
    }, 30000);
    // }, 3000);

    // const characterId = charList[randomInteger(0, charList.length - 1)];
    // callback({
    //   characterId,
    //   stateFrom: 'healthy',
    //   // stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
    //   stateTo: 'clinically_dead',
    //   // stateFrom: flag ? 'clinically_dead' : 'healthy',
    //   // stateTo: !flag ? 'clinically_dead' : 'healthy',
    //   timestamp: moment.utc().valueOf(),
    // });
    // flag = !flag;

    // }, 500);
    // }, 100);
  }

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  //   console.log(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

// exports.listenHealthChanges = listenHealthChanges;
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// throw new Error('boom');
