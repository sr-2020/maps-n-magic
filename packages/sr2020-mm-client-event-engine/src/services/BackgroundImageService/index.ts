import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata, 
  GameModel, 
  GMLogger,
  BackgroundImage,
  Req,
  Res
} from 'sr2020-mm-event-engine';

import { defaultBackgroundImages } from './DefaultBackgroundImages';

import { 
  backgroundImageMetadata,
  GetBackgroundImages,
  PostBackgroundImage,
  PutBackgroundImage,
  DeleteBackgroundImage,
  BackgroundImageEvents
} from "./types";

export class BackgroundImageService extends AbstractService<BackgroundImageEvents> {
  backgroundImages: BackgroundImage[];
  maxBackgroundImageId: number;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(backgroundImageMetadata);
    this.backgroundImages = R.clone(defaultBackgroundImages);
    this.maxBackgroundImageId = 1;
  }

  // @ts-ignore
  // setData({ backgroundImages } = {}) {
  //   this.backgroundImages = backgroundImages || R.clone(defaultBackgroundImages);
  //   this.maxBackgroundImageId = R.reduce(R.max, 1, R.pluck('id', this.backgroundImages)) as number;
  //   this.emit('backgroundImagesChanged', {
  //     type: 'backgroundImagesChanged',
  //     backgroundImages,
  //   });
  // }

  // getData() {
  //   return {
  //     backgroundImages: this.getBackgroundImages(),
  //   };
  // }

  getBackgroundImages(request: Req<GetBackgroundImages>): Res<GetBackgroundImages> {
    return this.backgroundImages;
  }

  postBackgroundImage({ props }: PostBackgroundImage) {
    this.maxBackgroundImageId++;
    const backgroundImage: BackgroundImage = {
      ...props,
      image: 'images/noImage.svg',
      id: this.maxBackgroundImageId,
      name: `Image ${String(this.maxBackgroundImageId)}`,
    };
    this.backgroundImages = [...this.backgroundImages, backgroundImage];
    this.emit2({ 
      type: 'postBackgroundImage',
      backgroundImage 
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
    // return backgroundImage;
  }

  putBackgroundImage({ id, props }: PutBackgroundImage) {
    const index = this.backgroundImages.findIndex((bi) => bi.id === id);
    this.backgroundImages = [...this.backgroundImages];
    this.backgroundImages[index] = {
      ...this.backgroundImages[index],
      ...props,
      id,
    };
    this.emit2({
      type: 'putBackgroundImage',
      backgroundImage: this.backgroundImages[index],
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
  }

  deleteBackgroundImage({ id }: DeleteBackgroundImage) {
    const index = this.backgroundImages.findIndex((bi) => bi.id === id);
    const backgroundImage = this.backgroundImages[index];
    this.backgroundImages = R.remove(index, 1, this.backgroundImages);
    this.emit2({
      type: 'deleteBackgroundImage',
      backgroundImage
    });
    this.emit2({
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
    // return backgroundImage;
  }
}
