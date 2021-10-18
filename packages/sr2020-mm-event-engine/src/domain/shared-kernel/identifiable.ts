export interface IntegerIdentifiable {
  id: number;
}
export interface StringIdentifiable {
  id: string;
}

export type Identifiable = IntegerIdentifiable | StringIdentifiable;