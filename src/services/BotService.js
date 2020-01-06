import * as R from 'ramda';

import { ActiveBot } from './ActiveBot';

export class BotService {
  metadata = {
    actions: ['putBot', 'runBot', 'moveBots', 'stopBots'],
    emitEvents: ['botUpdate'],
    listenEvents: ['modelRunningChange', 'modelTick'],
  };

  constructor() {
    this.bots = {};
    this.activeBots = [];
    this.onModelRunningChange = this.onModelRunningChange.bind(this);
    this.onModelTick = this.onModelTick.bind(this);
  }

  init(gameModel) {
    this.gameModel = gameModel;
    this.gameModel.on('modelRunningChange', this.onModelRunningChange);
    this.gameModel.on('modelTick', this.onModelTick);
  }

  dispose() {
    this.gameModel.off('modelRunningChange', this.onModelRunningChange);
    this.gameModel.off('modelTick', this.onModelTick);
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

  dispatch(action, onDefaultAction) {
    if (action.type === 'putBot') {
      this._putBot(action);
      return;
    }
    if (action.type === 'runBot') {
      this._runBot(action);
      return;
    }
    if (action.type === 'moveBots') {
      this._moveBots(action);
      return;
    }
    if (action.type === 'stopBots') {
      this._stopBots(action);
      return;
    }
    onDefaultAction(action);
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
    this.gameModel.emit('botUpdate', this.activeBots);

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
