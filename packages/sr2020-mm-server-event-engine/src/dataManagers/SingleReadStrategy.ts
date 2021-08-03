import { DataManager } from "./types";

export class SingleReadStrategy {
  // eslint-disable-next-line class-methods-use-this
  init(dataManager: DataManager) {
    dataManager.load();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}
}
