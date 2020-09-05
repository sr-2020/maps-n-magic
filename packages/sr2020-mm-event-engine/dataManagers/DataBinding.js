export class DataBinding {
  constructor({
    gameModel, entityName, DataProvider, DataManager, ReadStrategy, ReadStrategyArgs = [],
  }) {
    this.dataManager = new DataManager(
      gameModel,
      new DataProvider(),
      entityName,
      new ReadStrategy(gameModel, ...ReadStrategyArgs),
    );
    this.dataManager.initialize();
  }

  dispose() {
    this.dataManager.dispose();
  }
}
