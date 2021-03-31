import { GameModel, GMLogger } from "sr2020-mm-event-engine";

import { DataManager } from "./types";

export class PollingReadStrategy {
  dataManager: DataManager | null;

  loadEntityIntervalId: NodeJS.Timeout | null;

  constructor(
    private gameModel: GameModel, 
    private timeout: number, 
    private logger: GMLogger, 
    private reloadEventName?: string
  ) {
    this.load = this.load.bind(this);
    this.loadEntityIntervalId = null;
    this.dataManager = null;
  }

  initialize(dataManager: DataManager): void {
    this.dataManager = dataManager;
    this.subscribe('on');
    this.loadEntityIntervalId = setInterval(() => {
      this.load();
    }, this.timeout);
    this.load();
  }

  load() {
    if(this.dataManager !== null) {
      this.dataManager.load();
    } else {
      this.logger.warn("Calling load on PollingReadStrategy without data manager.")
    }
  }

  subscribe(action: 'on' | 'off') {
    if (this.reloadEventName) {
      this.gameModel[action](this.reloadEventName, this.load);
    }
  }

  dispose() {
    if (this.loadEntityIntervalId !== null) {
      clearInterval(this.loadEntityIntervalId);
    }
    this.subscribe('off');
  }
}
