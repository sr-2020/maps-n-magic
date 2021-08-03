import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Typed,
  TypeOnly,
  BackgroundImage,
  ServiceContract,
  ServiceContractTypes
} from 'sr2020-mm-event-engine';

// requests

export type GetBackgroundImages = (arg: TypeOnly<'backgroundImages'>) => BackgroundImage[];

// actions

export type PostBackgroundImage = Typed<'postBackgroundImage', {
  props: {
    latlngs: L.LatLngLiteral[][];
  }
}>;

export type PutBackgroundImage = Typed<'putBackgroundImage', {
  id: number;
  props: Partial<Omit<BackgroundImage, 'id'>>
}>;

export type DeleteBackgroundImage = Typed<'deleteBackgroundImage', {
  id: number;
}>;

// events

export type EPostBackgroundImage = Typed<'postBackgroundImage', {
  backgroundImage: BackgroundImage;
}>;
export type EPutBackgroundImage = Typed<'putBackgroundImage', {
  backgroundImage: BackgroundImage;
}>;
export type EDeleteBackgroundImage = Typed<'deleteBackgroundImage', {
  backgroundImage: BackgroundImage;
}>;
export type EBackgroundImagesChange = Typed<'backgroundImagesChanged', {
  backgroundImages: BackgroundImage[];
}>;

export type BackgroundImageEvents = 
  EPostBackgroundImage |
  EPutBackgroundImage |
  EDeleteBackgroundImage |
  EBackgroundImagesChange;

export interface BackgroundImageServiceContract extends ServiceContract {
  Request: GetBackgroundImages;
  Action: 
    | PostBackgroundImage
    | PutBackgroundImage
    | DeleteBackgroundImage;
  EmitEvent: BackgroundImageEvents;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

export const backgroundImageMetadata: ServiceContractTypes<BackgroundImageServiceContract> = {
  requests: ['backgroundImages'],
  actions: [
    'postBackgroundImage',
    'putBackgroundImage',
    'deleteBackgroundImage',
  ],
  emitEvents: [
    'postBackgroundImage',
    'putBackgroundImage',
    'deleteBackgroundImage',
    'backgroundImagesChanged',
  ],
  listenEvents: [],
  needRequests: [],
  needActions: []
};