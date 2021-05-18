export interface Gettable<T> {
  get(): Promise<T[]>;
}

export interface Postable<T> {
  post({props}: {props: T}): Promise<T>;
}

export interface Puttable<T> {
  put({id, props}: {id: number, props: T}): Promise<T>;
}

export interface MultiPuttable<T> {
  putMultiple({updates}: {updates: T[]}): Promise<T[]>;
}

export interface Deletable<T> {
  delete({id}: {id: number}): Promise<T>;
}