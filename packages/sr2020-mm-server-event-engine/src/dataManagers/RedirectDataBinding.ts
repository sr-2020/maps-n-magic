import * as R from 'ramda';
import { GameModel, GMLogger } from "sr2020-mm-event-engine";

export class RedirectDataBinding {
  constructor(
    private gameModel: GameModel, 
    private redirectIndex: Record<string, string>,
    private logger: GMLogger
  ) {
    this.emit = this.emit.bind(this);
    this.subscribe('on', this.gameModel);
  }

  dispose() {
    this.subscribe('off', this.gameModel);
  }

  subscribe(action: 'on' | 'off', gameModel: GameModel) {
    this.logger.info('redirectIndex keys', R.keys(this.redirectIndex));
    // console.log('redirectIndex keys', R.keys(this.redirectIndex));
    R.keys(this.redirectIndex).forEach((eventName) => gameModel[action](eventName, this.emit(eventName)));
  }

  // This is bad decision (subscribe on generated function) because function will be not removed by event emitter unsubsription.
  // Fix it in the future.
  // For now this stuff is used by single game model so it shouldn't make problems in nearest time.
  emit(eventName: string) {
    return (action: object) => {
      // console.log('redirect action', eventName);
      this.gameModel.execute({
        ...action,
        type: this.redirectIndex[eventName],
      });
    };
  }
}
