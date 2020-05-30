export class PollingReadStrategy {
  constructor(gameModel, timeout, reloadEventName) {
    this.gameModel = gameModel;
    this.timeout = timeout;
    this.reloadEventName = reloadEventName;
    this.loadEntities = this.loadEntities.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager) {
    this.dataManager = dataManager;
    this.subscribe('on');
    this.loadEntityIntervalId = setInterval(() => {
      this.loadEntities();
    }, this.timeout);
    this.loadEntities();
  }

  loadEntities() {
    this.dataManager.loadEntities();
  }

  subscribe(action) {
    if (this.reloadEventName) {
      this.gameModel[action](this.reloadEventName, this.loadEntities);
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
