import * as R from 'ramda';

import { AbstractService } from 'sr2020-mm-event-engine/core/AbstractService';

import { defaultBackgroundImages } from './DefaultBackgroundImages';

export class BackgroundImageService extends AbstractService {
  metadata = {
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
  };

  constructor() {
    super();
    this.backgroundImages = R.clone(defaultBackgroundImages);
    this.maxBackgroundImageId = 1;
  }

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
