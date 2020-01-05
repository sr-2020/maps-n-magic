// eslint-disable-next-line max-classes-per-file
import * as R from 'ramda';
import EventEmitter from 'events';

import { ActiveBot } from './ActiveBot';

import { UserService } from './UserService';

function stringToType(entity) {
  return R.is(String, entity) ? {
    type: entity,
  } : entity;
}

export class GameModel extends EventEmitter {
  constructor() {
    super();
    this.bots = {};
    this.activeBots = [];

    this.actionMap = {};

    this.userService = new UserService(this);
    this.registerService(this.userService);
    this.onDefaultAction = this.onDefaultAction.bind(this);
  }

  registerService(service) {
    const { actions } = service.metadata;
    const localActionMap = R.fromPairs(actions.map((action) => [action, service]));
    this.actionMap = {
      ...this.actionMap,
      ...localActionMap,
    };
  }

  dispatch(action) {
    action = stringToType(action);
    const service = this.actionMap[action.type];
    if (service) {
      service.dispatch(action, this.onDefaultAction);
      return;
    }
    if (action.type === 'runModel') {
      this._start();
      return;
    }
    if (action.type === 'stopModel') {
      this._stop();
      return;
    }
    this.onDefaultAction(action);
  }

  // eslint-disable-next-line class-methods-use-this
  onDefaultAction(action) {
    throw new Error(`Unknown action ${JSON.stringify(action)}`);
  }

  get(request) {
    request = stringToType(request);
    if (request.type === 'isModelRunning') {
      return this._isModelRunning();
    }
    throw new Error(`Unknown request ${JSON.stringify(request)}`);
  }

  _isModelRunning() {
    return this.mainCycleAbortController && !this.mainCycleAbortController.signal.aborted;
  }

  _stop() {
    if (this.mainCycleAbortController) {
      this.mainCycleAbortController.abort();
      this.activeBots.forEach((bot) => bot.stop());
      this.emit('modelRunningChange', false);
    }
  }

  _start() {
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
      this.emit('botUpdate', this.activeBots);

      if (R.isEmpty(this.activeBots)) {
        // this.runBot('bot1');
        R.keys(this.bots).forEach(this.runBot.bind(this));
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
    this._stop();
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
