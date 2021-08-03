import React, { ChangeEventHandler, Component, KeyboardEvent, SyntheticEvent } from 'react';
import './BackgroundImagePopup.css';
import { WithTranslation } from "react-i18next";

import ReactDOM from 'react-dom';

interface BackgroundImagePopupProps extends WithTranslation {
  imagePopupDom: HTMLElement;
  onClose: () => void;
  name: string;
  onChange: (prop: 'name' | 'image') => ChangeEventHandler;
  image: string;
}

export class BackgroundImagePopup extends Component<
  BackgroundImagePopupProps
> {

  constructor(props: BackgroundImagePopupProps) {
    super(props);
    this.state = {
    };
    this.addDefaultSrc = this.addDefaultSrc.bind(this);
  }

  componentDidMount() {
    console.log('BackgroundImagePopup mounted');
  }

  componentDidUpdate() {
    console.log('BackgroundImagePopup did update');
  }

  componentWillUnmount() {
    console.log('BackgroundImagePopup will unmount');
  }

  _handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  addDefaultSrc(ev: SyntheticEvent<HTMLImageElement>) {
    ev.currentTarget.src = 'images/noImage.svg';
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      // unattachedList, attachedList, selectedAddMarker, selectedRemoveMarker,
    } = this.state;
    const {
      name, onChange, t, image,
    } = this.props;

    // const common = 'tw-w-1/3 tw-font-bold tw-py-2 tw-px-4 focus:tw-outline-none focus:tw-shadow-outline';
    // const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
    // const unselectedButton = 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    return (
      <div className="LocationPopup">
        <div className="tw-mb-3">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="backgroundImageName"
          >
            {t('backgroundImageName')}
          </label>
          <input
            className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
            id="locationName"
            type="text"
            value={name}
            onChange={onChange('name')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="tw-mb-3">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="backgroundImageUrl"
          >
            {t('backgroundImageUrl')}
          </label>
          <input
            className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
            id="backgroundImageUrl"
            type="text"
            value={image}
            onChange={onChange('image')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div>
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="backgroundImagePreview"
          >
            {t('backgroundImagePreview')}
          </label>
          <img
            style={{
              maxHeight: '100px',
              maxWidth: '100px',
            }}
            className="fit-picture"
            src={image}
            onError={this.addDefaultSrc}
            alt=""
          />
        </div>
      </div>
    );
  }

  render() {
    const { imagePopupDom } = this.props;
    return ReactDOM.createPortal(
      this.makeContent(),
      imagePopupDom,
    );
  }
}
