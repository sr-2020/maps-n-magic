import { EventEmitter } from 'events';

import { L } from "../misc/leafletWrapper";

export interface OpenPopupEvent {
  popup: L.Popup;
}
export interface ClosePopupEvent {}
export interface SetLayersMetaEvent {
  layersMeta: Record<string, L.LayerGroup>;
  enableByDefault: boolean;
}
export interface RemoveLayersMetaEvent {
  layersMeta: Record<string, L.LayerGroup>;
}
export interface OnCreateLayerEvent {
  layer: L.Layer;
}
// TODO 
export interface OnRemoveLayerEvent {
  layer: L.Layer & {
    options: {
      id: number;
    }
  };
}

export type OpenPopupEventHandlerFn = (event: OpenPopupEvent) => void;
export type ClosePopupEventHandlerFn = () => void;
export type SetLayersMetaEventHandlerFn = (event: SetLayersMetaEvent) => void;
export type RemoveLayersMetaEventHandlerFn = (event: RemoveLayersMetaEvent) => void;
export type OnCreateLayerEventHandlerFn = (event: OnCreateLayerEvent) => void;
export type OnRemoveLayerEventHandlerFn = (event: OnRemoveLayerEvent) => void;
export type LocateControlEventHandlerFn = (enable: boolean) => void;
// export type ErrorEventHandlerFn = (event: ErrorEvent) => void;

// on(type: string, fn: LeafletEventHandlerFn, context?: any): this;

// on(type: 'tileerror',
// fn: TileErrorEventHandlerFn, context?: any): this;
// off(type: 'tileerror',
// fn?: TileErrorEventHandlerFn, context?: any): this;

interface EventHandler<
  EventType extends string, 
  EventHandlerFn extends (...args: any[]) => void
> {
  on(type: EventType, fn: EventHandlerFn, context?: any): this;
  off(type: EventType, fn?: EventHandlerFn, context?: any): this;
  emit(event: EventType, data: Parameters<EventHandlerFn>[0]): boolean;
}

// interface LayerCommunicator extends EventHandler<'openPopup', OpenPopupEventHandlerFn>{};
// interface LayerCommunicator extends EventHandler<'closePopup', ClosePopupEventHandlerFn>{};
//     // EventHandler<'closePopup', ClosePopupEventHandlerFn>,
//     // EventHandler<'setLayersMeta', SetLayersMetaEventHandlerFn>,
//     // EventHandler<'onCreateLayer', OnCreateLayerEventHandlerFn>,
//     // EventHandler<'onRemoveLayer', OnRemoveLayerEventHandlerFn>{}
// interface LayerCommunicator 
//   extends 
//     EventHandler<'openPopup', OpenPopupEventHandlerFn>,
//     EventHandler<'closePopup', ClosePopupEventHandlerFn>,
//     EventHandler<'setLayersMeta', SetLayersMetaEventHandlerFn>,
//     EventHandler<'onCreateLayer', OnCreateLayerEventHandlerFn>,
//     EventHandler<'onRemoveLayer', OnRemoveLayerEventHandlerFn>{}
export type LayerCommunicator = 
  & EventHandler<'openPopup', OpenPopupEventHandlerFn>
  & EventHandler<'closePopup', ClosePopupEventHandlerFn>
  & EventHandler<'setLayersMeta', SetLayersMetaEventHandlerFn>
  & EventHandler<'removeLayersMeta', RemoveLayersMetaEventHandlerFn>
  & EventHandler<'onCreateLayer', OnCreateLayerEventHandlerFn>
  & EventHandler<'onRemoveLayer', OnRemoveLayerEventHandlerFn>
  & EventHandler<'locateControl', LocateControlEventHandlerFn>
;

  // this.layerCommunicator[action]('removeLayersMeta', this.removeLayersMeta);
  // this.layerCommunicator[action]('addToMap', this.addToMap);

  // removeLayersMeta({ layersMeta }: {layersMeta: LayersMeta}): void {


// export class LayerCommunicatorImpl 
//   extends 
//     EventEmitter 
//   // implements 
//   //   EventHandler<'openPopup', OpenPopupEventHandlerFn>,
//   //   EventHandler<'closePopup', ClosePopupEventHandlerFn>,
//   //   EventHandler<'setLayersMeta', SetLayersMetaEventHandlerFn>,
//   //   EventHandler<'onCreateLayer', OnCreateLayerEventHandlerFn>,
//   //   EventHandler<'onRemoveLayer', OnRemoveLayerEventHandlerFn>
// {
//   // on(type: 'openPopup', fn: OpenPopupEventHandlerFn, context?: any): this;
//   // on(type: 'closePopup', fn: ClosePopupEventHandlerFn, context?: any): this;
//   // on(type: 'setLayersMeta', fn: SetLayersMetaEventHandlerFn, context?: any): this;
//   // on(type: 'onCreateLayer', fn: OnCreateLayerEventHandlerFn, context?: any): this;
//   // on(type: 'onRemoveLayer', fn: OnRemoveLayerEventHandlerFn, context?: any): this;
//   // on(event: string , listener: (...args: any[]) => void): this { 
//   //   return super.on(event, listener);
//   // }
//   // off(event: string | symbol, listener: (...args: any[]) => void): this { 
//   //   return super.off(event, listener);
//   // }
//   // emit(event: string | symbol, ...args: any[]): boolean { 
//   //   return super.emit(event, ...args);
//   // }
// }



// const ttt: LayerCommunicator = new LayerCommunicatorImpl();


// ttt.on('setLayersMeta', (event: {t: 12}) => {});