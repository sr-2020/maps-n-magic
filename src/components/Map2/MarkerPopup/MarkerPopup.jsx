import React, { Component } from 'react';
import './MarkerPopup.css';
import ReactDOM from 'react-dom';
import { MarkerPopupPropTypes } from '../../../types';

import { markerPopupDom } from '../../../utils/domUtils';

export class MarkerPopup extends Component {
  static propTypes = MarkerPopupPropTypes;

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      name, lat, lng, onChange,
    } = this.props;

    return (
      <div className="MarkerPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerName"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerName"
            type="text"
            value={name}
            onChange={onChange('name')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerLat"
          >
            Latitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerLat"
            type="text"
            value={lat}
            onChange={onChange('lat')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="markerLng"
          >
            Longitude
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="markerLng"
            type="text"
            value={lng}
            onChange={onChange('lng')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      this.makeContent(),
      markerPopupDom,
    );
  }
}
