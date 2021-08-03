import { EventEmitter } from 'events';
import { TFunction } from 'react-i18next';
import { Translator } from "../utils/Translator";

export interface LayersMeta {
  [layerName: string]: L.Layer;
}

export interface CommonLayerProps {
  layerCommunicator: EventEmitter;
  translator: Translator;
}

export interface TileLayerData {
  urlTemplate: string;
  options: L.TileLayerOptions;
}

export interface MapDefaults {
  defaultTileLayer: TileLayerData;
  defaultZoom: number;
  defaultCenter: [number, number];
}

export type SRTKey = Parameters<TFunction>[0];

export interface NavLinkData {
  to: string;
  tKey: SRTKey;
  rawLink?: string;
}