import * as R from 'ramda';

import { AbstractService, Metadata } from 'sr2020-mm-event-engine';

import { defaultBackgroundImages } from './DefaultBackgroundImages';

const metadata: Metadata = {
  actions: [
    'putBackgroundImage',
    'postBackgroundImage',
    'deleteBackgroundImage',
  ],
  requests: ['backgroundImages'],
  emitEvents: [
    'putBackgroundImage',
    'postBackgroundImage',
    'deleteBackgroundImage',
    'backgroundImagesChanged',
  ],
  listenEvents: [],
  needRequests: [],
  needActions: []
};
export class BackgroundImageService extends AbstractService {
  backgroundImages: any[];
  maxBackgroundImageId: any;

  constructor() {
    super();
    this.setMetadata(metadata);
    this.backgroundImages = R.clone(defaultBackgroundImages);
    this.maxBackgroundImageId = 1;
  }

  // @ts-ignore
  setData({ backgroundImages } = {}) {
    this.backgroundImages = backgroundImages || R.clone(defaultBackgroundImages);
    this.maxBackgroundImageId = R.reduce(R.max, 1, R.pluck('id', this.backgroundImages));
    this.emit('backgroundImagesChanged', {
      type: 'backgroundImagesChanged',
      backgroundImages,
    });
  }

  getData() {
    return {
      backgroundImages: this.getBackgroundImages(),
    };
  }

  getBackgroundImages() {
    return this.backgroundImages;
  }

  putBackgroundImage({ id, props }) {
    const index = this.backgroundImages.findIndex((bi) => bi.id === id);
    this.backgroundImages = [...this.backgroundImages];
    this.backgroundImages[index] = {
      ...this.backgroundImages[index],
      ...props,
      id,
    };
    this.emit('putBackgroundImage', {
      backgroundImage: this.backgroundImages[index],
    });
    this.emit('backgroundImagesChanged', {
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
  }

  postBackgroundImage({ props }) {
    this.maxBackgroundImageId++;
    const backgroundImage = {
      ...props,
      image: 'images/noImage.svg',
      id: this.maxBackgroundImageId,
      name: `Image ${String(this.maxBackgroundImageId)}`,
    };
    this.backgroundImages = [...this.backgroundImages, backgroundImage];
    this.emit('postBackgroundImage', { backgroundImage });
    this.emit('backgroundImagesChanged', {
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
    return backgroundImage;
  }

  deleteBackgroundImage({ id }) {
    const index = this.backgroundImages.findIndex((bi) => bi.id === id);
    const backgroundImage = this.backgroundImages[index];
    this.backgroundImages = R.remove(index, 1, this.backgroundImages);
    this.emit('deleteBackgroundImage', { backgroundImage });
    this.emit('backgroundImagesChanged', {
      type: 'backgroundImagesChanged',
      backgroundImages: this.backgroundImages,
    });
    return backgroundImage;
  }
}
