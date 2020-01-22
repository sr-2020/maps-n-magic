import * as R from 'ramda';

import { ActiveBot } from './ActiveBot';

import { AbstractService } from './AbstractService';

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

  onModelRunningChange(isModelRunning) {
    if (!isModelRunning) {
      this._stopBots();
    }
  }

  onModelTick(data) {
    this._moveBots(data);
    // if (!isModelRunning) {
    //   this._stopBots();
    // }
  }

  execute(action, onDefaultAction) {
    if (action.type === 'putBot') {
      return this._putBot(action);
    }
    if (action.type === 'runBot') {
      return this._runBot(action);
    }
    if (action.type === 'moveBots') {
      return this._moveBots(action);
    }
    if (action.type === 'stopBots') {
      return this._stopBots(action);
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    // request = stringToType(request);
    if (request.type === 'activeBots') {
      return this._getActiveBots(request);
    }
    return onDefaultRequest(request);
  }

  _getActiveBots() {
    return this.activeBots;
  }

  _putBot({ name, bot }) {
    this.bots[name] = bot;
  }

  _runBot({ name }) {
    // this.activeBots[name] = new ActiveBot(name, this.bots[name]);
    this.activeBots.push(new ActiveBot(name, this.bots[name]));
  }

  _stopBots() {
    this.activeBots.forEach((bot) => bot.stop());
  }

  _moveBots({ time }) {
    this.activeBots = this.activeBots.filter((bot) => bot.hasNext());
    this.activeBots.forEach((bot) => bot.next(time));
    this.emit('botUpdate', {
      bots: this.activeBots,
    });

    if (R.isEmpty(this.activeBots)) {
      // this.runBot('bot1');
      R.keys(this.bots).forEach((name) => this._runBot({ name }));
      // R.keys(this.bots).forEach((name) => this.dispatch({
      //   type: 'runBot',
      //   name,
      // }));
    }
  }
}
