import { Typed } from "../../core";
import { Spirit, SuitedState } from "../mm-spirit";

export interface LocationView {
  id: number;
  label: string;
  manaLevel: number;
}

export interface SpiritView extends Spirit {
  locationId: number;
}

export interface AggregatedLocationView extends LocationView {
  spiritViews: SpiritView[];
}

export type GetAggLocationView = (arg: Typed<'aggLocationView', {id: number}>) => 
  AggregatedLocationView | undefined;

export type GetSpiritSuitState = (arg: Typed<'spiritSuitState', {characterid: number}>) => 
  SuitedState | undefined;