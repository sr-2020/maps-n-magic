import { 
  Identifiable
} from 'sr2020-mm-event-engine';

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

// new interfaces for PG communication

export interface Gettable2<T extends Identifiable> {
  get(): Promise<T[]>;
}
export interface Postable2<T extends Identifiable> {
  post(entity: Partial<Omit<T, "id">>): Promise<T>;
}

export interface Puttable2<T extends Identifiable> {
  put(entity: T): Promise<T>;
}

// export interface MultiPuttable2<T extends Identifiable> {
//   putMultiple({updates}: {updates: T[]}): Promise<T[]>;
// }

export interface Deletable2<T extends Identifiable> {
  delete(id: number): Promise<T | null>;
}

export interface Manageable2<T extends Identifiable> extends 
  Gettable2<T>, 
  Postable2<T>, 
  Puttable2<T>, 
  Deletable2<T> 
{}