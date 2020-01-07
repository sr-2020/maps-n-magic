import { AbstractService } from './AbstractService';

export class TickerService extends AbstractService {
  metadata = {
    actions: ['runModel', 'stopModel'],
    requests: ['isModelRunning'],
    emitEvents: ['modelRunningChange', 'modelTick'],
  };

  constructor() {
    super();
    this.mainCycleAbortController = null;
  }

  init(gameModel) {
    this.gameModel = gameModel;
  }

  execute(action, onDefaultAction) {
    if (action.type === 'runModel') {
      return this._start();
    }
    if (action.type === 'stopModel') {
      return this._stop();
    }
    return onDefaultAction(action);
  }

  get(request, onDefaultRequest) {
    // request = stringToType(request);
    if (request.type === 'isModelRunning') {
      return this._isModelRunning();
    }
    return onDefaultRequest(request);
  }

  dispose() {
    this._stop();
  }

  _isModelRunning() {
    return this.mainCycleAbortController && !this.mainCycleAbortController.signal.aborted;
  }

  _stop() {
    if (this.mainCycleAbortController) {
      this.mainCycleAbortController.abort();
      this.gameModel.emit('modelRunningChange', false);
    }
  }

  _start() {
    console.log(this);
    const start = performance.now();
    this.mainCycleAbortController = new AbortController();
    // const animation = {
    //   enable: true,
    // };

    // const filterBots = R.pipe(R.toPairs, R.filter(([, bot]) => bot.hasNext()), R.fromPairs);

    requestAnimationFrame(function animate2(time) {
      // console.log(options.key || 'animation triggered');
      // if (!animation.enable) return;
      if (this.mainCycleAbortController.signal.aborted) return;

      // console.log(time - start);
      // this.activeBots = filterBots(this.activeBots);

      this.gameModel.emit('modelTick', {
        time,
      });
      // this.dispatch({
      //   type: 'moveBots',
      //   time,
      // });
      // this.activeBots = this.activeBots.filter((bot) => bot.hasNext());
      // this.activeBots.forEach((bot) => bot.next(time));
      // // R.values(this.activeBots).forEach((bot) => bot.next(time));
      // this.emit('botUpdate', this.activeBots);

      // if (R.isEmpty(this.activeBots)) {
      //   // this.runBot('bot1');
      //   R.keys(this.bots).forEach((name) => this.dispatch({
      //     type: 'runBot',
      //     name,
      //   }));
      // }

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

    this.gameModel.emit('modelRunningChange', true);
    // return animation;
  }
}
