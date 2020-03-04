import * as R from 'ramda';

import { AbstractService } from './AbstractService';

export class MapImageService extends AbstractService {
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
    ],
    listenEvents: [],
  };

  constructor() {
    super();
    this.backgroundImages = [];
    this.maxBackgroundImageId = 1;
  }

  setData({ backgroundImages } = {}) {
    this.backgroundImages = backgroundImages || [];
    this.maxBackgroundImageId = R.reduce(R.max, 1, R.pluck('id', this.backgroundImages));
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
    this.backgroundImages[index] = {
      ...this.backgroundImages[index],
      ...props,
      id,
    };
    this.emit('putBackgroundImage', {
      backgroundImage: this.backgroundImages[index],
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
    this.backgroundImages.push(backgroundImage);
    this.emit('postBackgroundImage', { backgroundImage });
    return backgroundImage;
  }

  deleteBackgroundImage({ id }) {
    const index = this.backgroundImages.findIndex((bi) => bi.id === id);
    const backgroundImage = this.backgroundImages[index];
    this.backgroundImages = R.remove(index, 1, this.backgroundImages);
    this.emit('deleteBackgroundImage', { backgroundImage });
    return backgroundImage;
  }
}
