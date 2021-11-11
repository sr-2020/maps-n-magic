import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  Req,
  Res
} from '../../core';

import { BackgroundImage } from "../../domain";

import { 
  Typed,
  TypeOnly,
  ServiceContract,
  ServiceContractTypes
} from '../../core';


// requests

export type GetBackgroundImages = (arg: TypeOnly<'backgroundImages'>) => BackgroundImage[];
export type GetBackgroundImage = (arg: Typed<'backgroundImage', {id: number}>) => BackgroundImage | undefined;

// emit events

export type SingleBackgroundImage = {
  backgroundImage: BackgroundImage;
};
export type PostBackgroundImageArgs = {
  props: Partial<Omit<BackgroundImage, 'id'>>
};
export type PutBackgroundImageArgs = {
  id: number;
  props: Partial<Omit<BackgroundImage, 'id'>>;
};
export type DeleteBackgroundImageArgs = {
  id: number;
};

export type BackgroundImageList = {
  backgroundImages: BackgroundImage[]
};

export type EPostBackgroundImageRequested = Typed<'postBackgroundImageRequested', PostBackgroundImageArgs>;
export type EPostBackgroundImage = Typed<'postBackgroundImage', SingleBackgroundImage>;
export type EPutBackgroundImageRequested = Typed<'putBackgroundImageRequested', PutBackgroundImageArgs>;
export type EPutBackgroundImage = Typed<'putBackgroundImage', SingleBackgroundImage>;
export type EDeleteBackgroundImageRequested = Typed<'deleteBackgroundImageRequested', DeleteBackgroundImageArgs>;
export type EDeleteBackgroundImage = Typed<'deleteBackgroundImage', SingleBackgroundImage>;
export type EBackgroundImagesChanged = Typed<'backgroundImagesChanged', BackgroundImageList>;

export type BackgroundImageEmitEvents = 
  EPostBackgroundImage |
  EPutBackgroundImage |
  EDeleteBackgroundImage |
  EBackgroundImagesChanged |
  EPostBackgroundImageRequested
;

// listen events

export type EPostBackgroundImageConfirmed = Typed<'postBackgroundImageConfirmed', SingleBackgroundImage>;
export type EPutBackgroundImageConfirmed = Typed<'putBackgroundImageConfirmed', SingleBackgroundImage>;
export type EDeleteBackgroundImageConfirmed = Typed<'deleteBackgroundImageConfirmed', SingleBackgroundImage>;
export type ESetBackgroundImages = Typed<'setBackgroundImages', BackgroundImageList>;
export type ECloneBackgroundImageRequested = Typed<'cloneBackgroundImageRequested', {
  id: number;
}>;

export type BackgroundImageListenEvents = 
  EPostBackgroundImageConfirmed |
  EPutBackgroundImageConfirmed |
  EDeleteBackgroundImageConfirmed |
  ESetBackgroundImages |
  ECloneBackgroundImageRequested
;

export interface BackgroundImageServiceContract extends ServiceContract {
  Request: GetBackgroundImages | GetBackgroundImage;
  Action: never;
  EmitEvent: BackgroundImageEmitEvents;
  ListenEvent: BackgroundImageListenEvents;
  NeedAction: never;
  NeedRequest: never;
}

export const backgroundImageMetadata: ServiceContractTypes<BackgroundImageServiceContract> = {
  requests: ['backgroundImages', 'backgroundImage'],
  actions: [],
  emitEvents: [
    'postBackgroundImage',
    'postBackgroundImageRequested',
    'putBackgroundImage',
    'deleteBackgroundImage',
    'backgroundImagesChanged',
  ],
  listenEvents: [
    'postBackgroundImageConfirmed',
    'putBackgroundImageConfirmed',
    'deleteBackgroundImageConfirmed',
    'setBackgroundImages',
    'cloneBackgroundImageRequested'
  ],
  needActions: [],
  needRequests: [],
};

export class BackgroundImageService extends AbstractService<BackgroundImageServiceContract> {
  backgroundImages: BackgroundImage[];

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(backgroundImageMetadata);
    this.backgroundImages = [];
    this.setBackgroundImages = this.setBackgroundImages.bind(this);
    this.postBackgroundImageConfirmed = this.postBackgroundImageConfirmed.bind(this);
    this.putBackgroundImageConfirmed = this.putBackgroundImageConfirmed.bind(this);
    this.deleteBackgroundImageConfirmed = this.deleteBackgroundImageConfirmed.bind(this);
    this.cloneBackgroundImageRequested = this.cloneBackgroundImageRequested.bind(this);
  }

  init() {
    super.init();
    this.on2('setBackgroundImages', this.setBackgroundImages);
    this.on2('postBackgroundImageConfirmed', this.postBackgroundImageConfirmed);
    this.on2('putBackgroundImageConfirmed', this.putBackgroundImageConfirmed);
    this.on2('deleteBackgroundImageConfirmed', this.deleteBackgroundImageConfirmed);
    this.on2('cloneBackgroundImageRequested', this.cloneBackgroundImageRequested);
  }

  dispose() {
    this.off2('setBackgroundImages', this.setBackgroundImages);
    this.off2('postBackgroundImageConfirmed', this.postBackgroundImageConfirmed);
    this.off2('putBackgroundImageConfirmed', this.putBackgroundImageConfirmed);
    this.off2('deleteBackgroundImageConfirmed', this.deleteBackgroundImageConfirmed);
    this.off2('cloneBackgroundImageRequested', this.cloneBackgroundImageRequested);
  }

  setData({ backgroundImages = [] }: BackgroundImageList) {
    // this.logger.info("called setData with arr length", backgroundImages.length);
    // better data reuse
    // const { updated, added, unchanged } = getArrDiff(backgroundImages, this.backgroundImages, R.prop('id'));
    // this.backgroundImages = [...unchanged, ...R.pluck('item', updated), ...added];
    // return backgroundImages.length === this.backgroundImages && unchanged.length === backgroundImages.length;
    this.backgroundImages = backgroundImages;
  }

  getBackgroundImages(request: Req<GetBackgroundImages>): Res<GetBackgroundImages> {
    return [...this.backgroundImages];
  }

  getBackgroundImage ({ id }: Req<GetBackgroundImage>): Res<GetBackgroundImage> {
    const backgroundImage = this.backgroundImages.find((backgroundImage) => backgroundImage.id === id);
    return backgroundImage !== undefined ? {...backgroundImage} : undefined;
  }

  setBackgroundImages({ backgroundImages }: ESetBackgroundImages ): void {
    this.setData({ backgroundImages });
    // const hasChanges =
    // if (!hasChanges) {
    //   return;
    // }
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages,
    });
  }

  putBackgroundImageConfirmed({ backgroundImage }: EPutBackgroundImageConfirmed): void {
    const index: number = this.backgroundImages.findIndex((br) => br.id === backgroundImage.id);
    this.backgroundImages = [...this.backgroundImages];
    this.backgroundImages[index] = backgroundImage;
    this.emit2({ 
      type: 'putBackgroundImage',
      backgroundImage 
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
  }

  postBackgroundImageConfirmed({ backgroundImage }: EPostBackgroundImageConfirmed): void {
    this.backgroundImages = [...this.backgroundImages, backgroundImage];
    // console.log('postBackgroundImage');
    this.emit2({ 
      type: 'postBackgroundImage',
      backgroundImage 
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
  }
  
  deleteBackgroundImageConfirmed({ backgroundImage }: EDeleteBackgroundImageConfirmed): void {
    this.backgroundImages = this.backgroundImages.filter((br) => br.id !== backgroundImage.id);
    this.emit2({ 
      type: 'deleteBackgroundImage',
      backgroundImage 
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
  }

  cloneBackgroundImageRequested(event: ECloneBackgroundImageRequested): void {
    const { id } = event;
    const backgroundImage = this.backgroundImages.find((br) => br.id === id);
    if (backgroundImage === undefined) {
      return;
    }
    this.emit2({
      type: 'postBackgroundImageRequested',
      props: {
        ...backgroundImage,
        name: this._makeBackgroundImageName(backgroundImage.name)
      }
    });
  }

  private _makeBackgroundImageName(name: string): string {
    const backgroundImageMap = R.indexBy(R.prop('name'), this.backgroundImages);
    const base = `${name} clone`;
    let newName = base;
    let counter = 1;
    // eslint-disable-next-line eqeqeq
    while (backgroundImageMap[newName] != undefined) {
      newName = `${base} ${counter}`;
      counter++;
    }
    return newName;
  }
}
