import { Typed } from "..";

export interface LocationView {
  id: number;
  label: string;
  manaLevel: number;
}

export interface SpiritView {
  id: number;
  name: string;
  fraction: number;
  fractionName: string;
  locationId: number;
}

export interface AggregatedLocationView extends LocationView {
  spiritViews: SpiritView[];
}

export type GetAggLocationView = (arg: Typed<'aggLocationView', {id: number}>) => 
  AggregatedLocationView | undefined;