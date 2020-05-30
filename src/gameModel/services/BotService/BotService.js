import * as R from 'ramda';

import { ActiveBot } from './ActiveBot';

import { AbstractService } from '../../core/AbstractService';

export class BotService extends AbstractService {
  metadata = {
    actions: ['putBot', 'runBot', 'moveBots', 'stopBots'],
    requests: ['activeBots'],
    emitEvents: ['botUpdate'],
    listenEvents: ['modelRunningChange', 'modelTick'],
  };

  constructor() {
    super();
    this.bots = {};
    this.activeBots = [];
    this.onModelRunningChange = this.onModelRunningChange.bind(this);
    this.onModelTick = this.onModelTick.bind(this);
  }

  init(...args) {
    super.init(...args);
    this.on('modelRunningChange', this.onModelRunningChange);
    this.on('modelTick', this.onModelTick);
  }

  dispose() {
    this.off('modelRunningChange', this.onModelRunningChange);
    this.off('modelTick', this.onModelTick);
  }

  onModelRunningChange({ isModelRunning }) {
    if (!isModelRunning) {
      this.stopBots();
    }
  }

  onModelTick(data) {
    this.moveBots(data);
    // if (!isModelRunning) {
    //   this._stopBots();
    // }
  }

  getActiveBots() {
    return this.activeBots;
  }

  putBot({ name, bot }) {
    this.bots[name] = bot;
  }

  runBot({ name }) {
    // this.activeBots[name] = new ActiveBot(name, this.bots[name]);
    this.activeBots.push(new ActiveBot(name, this.bots[name]));
  }

  stopBots() {
    this.activeBots.forEach((bot) => bot.stop());
  }

  moveBots({ time }) {
    this.activeBots = this.activeBots.filter((bot) => bot.hasMoreTasks());
    this.activeBots.forEach((bot) => bot.runTask(time));
    this.emit('botUpdate', {
      bots: this.activeBots,
    });

    if (R.isEmpty(this.activeBots)) {
      // this.runBot('bot1');
      R.keys(this.bots).forEach((name) => this.runBot({ name }));
      // R.keys(this.bots).forEach((name) => this.dispatch({
      //   type: 'runBot',
      //   name,
      // }));
    }
  }
}
