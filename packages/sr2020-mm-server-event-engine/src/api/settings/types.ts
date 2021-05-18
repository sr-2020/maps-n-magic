export interface GetSettings<T> {
  get(): Promise<T>;
}

export interface PostSettings<T> {
  post(settings: T): Promise<T>;
}