import { EventEmitter } from 'events';
import { Translator } from "../utils/Translator";

export interface LayersMeta {
  [layerName: string]: L.Layer;
}

export interface CommonLayerProps {
  layerCommunicator: EventEmitter;
  translator: Translator;
}