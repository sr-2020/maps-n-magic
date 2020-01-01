import * as R from 'ramda';
import EventEmitter from 'events';

import { ActiveBot } from './ActiveBot';

export class GameModel extends EventEmitter {
  constructor() {
    super();
    this.bots = {};
    this.activeBots = [];
  }

  getActiveBots() {
    return this.activeBots;
  }

  isModelRunning() {
    return this.mainCycleAbortController && !this.mainCycleAbortController.signal.aborted;
  }

  stop() {
    if (this.mainCycleAbortController) {
      this.mainCycleAbortController.abort();
      this.activeBots.forEach((bot) => bot.stop());
      this.emit('modelRunningChange', false);
    }
  }

  start(options) {
    console.log(this);
    const start = performance.now();
    this.mainCycleAbortController = new AbortController();
    // const animation = {
    //   enable: true,
    // };

    const filterBots = R.pipe(R.toPairs, R.filter(([, bot]) => bot.hasNext()), R.fromPairs);

    requestAnimationFrame(function animate2(time) {
      // console.log(options.key || 'animation triggered');
      // if (!animation.enable) return;
      if (this.mainCycleAbortController.signal.aborted) return;

      // console.log(time - start);


      // this.activeBots = filterBots(this.activeBots);
      this.activeBots = this.activeBots.filter((bot) => bot.hasNext());
      this.activeBots.forEach((bot) => bot.next(time));
      // R.values(this.activeBots).forEach((bot) => bot.next(time));
      this.emit('botUpdate');

      if (R.isEmpty(this.activeBots)) {
        this.runBot('bot1');
      }

      // // timeFraction from 0 to 1
      // let timeFraction = (time - start) / options.duration;
      // if (timeFraction > 1) timeFraction = 1;

      // // current animation state
      // const progress = options.timing(timeFraction);

      // options.draw(progress);

      // if (timeFraction < 1) {
      requestAnimationFrame(animate2.bind(this));
      // } else if (options.loop) {
      //   start += options.duration;
      //   requestAnimationFrame(animate2);
      // }
    }.bind(this));

    this.emit('modelRunningChange', true);
    // return animation;
  }

  dispose() {
    this.stop();
    // if (this.mainCycleAbortController) {
    //   this.mainCycleAbortController.abort();
    // }
  }

  putBot(name, bot) {
    this.bots[name] = bot;
  }

  getBot(name) {
    return this.bots[name];
  }

  runBot(name) {
    // this.activeBots[name] = new ActiveBot(name, this.bots[name]);
    this.activeBots.push(new ActiveBot(name, this.bots[name]));
  }
}


// export class GameModel extends EventEmitter {
//   constructor() {
//     this.services = [];
//   }

//   putService(Service) {
//     const service = new Service(this);
//     this.services.push(service);
//   }

//   // dispose() {
//   //   this.services.forEach((service) => service.dispose());
//   //   delete this.services;
//   // }

//   // dispatch(action) {

//   // }
// }
