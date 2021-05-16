export interface DataManager {
  load(): void;
}

export interface ReadStrategy {
  dispose(): void;
  init(dataManager: DataManager): void;
}

export interface DataProvider {
  post(arg0: unknown): Promise<unknown>;
  get(): Promise<unknown>;

}