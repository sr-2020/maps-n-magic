export class SingleReadStrategy {
  // eslint-disable-next-line class-methods-use-this
  initialize(dataManager) {
    dataManager.loadEntities();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose() {}
}
