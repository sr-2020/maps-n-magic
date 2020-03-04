import React, { Component } from 'react';
import './BackgroundImagePopup.css';

import ReactDOM from 'react-dom';

// import { BackgroundImagePopupPropTypes } from '../../types';

export class BackgroundImagePopup extends Component {
  // static propTypes = BackgroundImagePopupPropTypes;

  constructor(props) {
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

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  addDefaultSrc(ev) {
    ev.target.src = 'images/noImage.svg';
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      unattachedList, attachedList, selectedAddMarker, selectedRemoveMarker,
    } = this.state;
    const {
      name, onChange, t, image,
    } = this.props;

    const common = 'w-33p font-bold py-2 px-4 focus:outline-none focus:shadow-outline';
    const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
    const unselectedButton = 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    return (
      <div className="LocationPopup">
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="backgroundImageName"
          >
            {t('backgroundImageName')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="locationName"
            type="text"
            value={name}
            onChange={onChange('name')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="backgroundImageUrl"
          >
            {t('backgroundImageUrl')}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="backgroundImageUrl"
            type="text"
            value={image}
            onChange={onChange('image')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
