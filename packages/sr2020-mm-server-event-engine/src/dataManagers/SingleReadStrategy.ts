import { DataManager } from "./types";

export class SingleReadStrategy {
  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager: DataManager) {
    dataManager.load();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}
}
