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

export interface typelessValidateEntityFunction {
  (entity: any): any;
  errors?: null | unknown[];
}
export interface validateEntityFunction<T> {
  (entity: any): entity is T;
  errors?: null | unknown[];
}

export interface Gettable2<T extends Identifiable> {
  get(): Promise<unknown[]>;
  validateEntity: validateEntityFunction<T>;
}

export interface SingleGettable2<T extends Identifiable> {
  singleGet(id: Identifiable["id"]): Promise<unknown>;
  validateEntity: validateEntityFunction<T>;
}

export interface Postable2<T extends Identifiable> {
  post(entity: Omit<T, "id">): Promise<T>;
  validateNewEntity: validateEntityFunction<Omit<T, "id">>;
  fillNewEntity(entity: Partial<Omit<T, "id">>): Omit<T, "id">;
}

export interface Puttable2<T extends Identifiable> {
  put(entity: T): Promise<T>;
  validateEntity: validateEntityFunction<T>;
}

export interface MultiPuttable2<T extends Identifiable> {
  putMultiple(entities: T[]): Promise<T[]>;
  validateEntity: validateEntityFunction<T>;
}

export interface Deletable2<T extends Identifiable> {
  delete(id: number): Promise<unknown | null>;
  validateEntity: validateEntityFunction<T>;
}

export interface Manageable2<T extends Identifiable> extends 
  Gettable2<T>, 
  SingleGettable2<T>,
  Postable2<T>, 
  Puttable2<T>, 
  Deletable2<T> 
{}

export interface ManageablePlus2<T extends Identifiable> extends 
  Gettable2<T>, 
  SingleGettable2<T>,
  Postable2<T>, 
  Puttable2<T>,
  MultiPuttable2<T>,
  Deletable2<T>
{}