import * as R from 'ramda';

export class RedirectDataBinding {
  gameModel: any;

  redirectIndex: any;

  constructor(gameModel, redirectIndex) {
    this.gameModel = gameModel;
    this.redirectIndex = redirectIndex;
    this.emit = this.emit.bind(this);
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    this.subscribe('off', this.gameModel);
  }

  subscribe(action, gameModel) {
    this.gameModel.logger.info('redirectIndex keys', R.keys(this.redirectIndex));
    // console.log('redirectIndex keys', R.keys(this.redirectIndex));
    R.keys(this.redirectIndex).forEach((eventName) => gameModel[action](eventName, this.emit(eventName)));
  }

  // This is bad decision (subscribe on generated function) because function will be not removed by event emitter unsubsription.
  // Fix it in the future.
  // For now this stuff is used by single game model so it shouldn't make problems in nearest time.
  emit(eventName) {
    return (action) => {
      // console.log('redirect action', eventName);
      this.gameModel.execute({
        ...action,
        type: this.redirectIndex[eventName],
      });
    };
  }
}
