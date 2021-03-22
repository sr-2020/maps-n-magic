import { GameModel } from "sr2020-mm-event-engine";

import { DataManager } from "./types";

export class PollingReadStrategy {
  dataManager: DataManager;

  loadEntityIntervalId: NodeJS.Timeout;

  constructor(
    private gameModel: GameModel, 
    private timeout: number, 
    private reloadEventName: string
  ) {
    this.load = this.load.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager: DataManager): void {
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

  subscribe(action: 'on' | 'off') {
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
