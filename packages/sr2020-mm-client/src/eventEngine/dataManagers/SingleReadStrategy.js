export class SingleReadStrategy {
  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager) {
    dataManager.load();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}
}
