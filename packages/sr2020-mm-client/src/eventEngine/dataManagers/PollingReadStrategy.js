export class PollingReadStrategy {
  constructor(gameModel, timeout, reloadEventName) {
    this.gameModel = gameModel;
    this.timeout = timeout;
    this.reloadEventName = reloadEventName;
    this.load = this.load.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager) {
    this.dataManager = dataManager;
    this.subscribe('on');
    this.loadEntityIntervalId = setInterval(() => {
      this.load();
    }, this.timeout);
    this.load();
  }

  load() {
    this.dataManager.load();
  }

  subscribe(action) {
    if (this.reloadEventName) {
      this.gameModel[action](this.reloadEventName, this.load);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {
    clearInterval(this.loadEntityIntervalId);
    this.subscribe('off');
    this.gameModel = null;
    this.timeout = null;
    this.reloadEventName = null;
  }
}
