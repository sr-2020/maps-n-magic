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

export interface PubSubDataSource<MessageType> {
  on(event: 'message', listener: (data: MessageType) => void): this;
  off(event: 'message', listener: (data: MessageType) => void): this;
  start(): void;
}

export class MockedPubSubDataSource<MessageType> implements PubSubDataSource<MessageType> {
  on(event: "message", listener: (data: MessageType) => void): this {
    return this;
  }
  off(event: "message", listener: (data: MessageType) => void): this {
    return this;
  }
  start(): void {}
}