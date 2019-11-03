import React, { Component } from 'react';
import './MarkerPopup.css';
import { MarkerPopupPropTypes } from '../../../types';

export class MarkerPopup extends Component {
  static propTypes = MarkerPopupPropTypes;

  _handleKeyDown = (e) => {
    console.log('do validate');
    if (e.key === 'Enter') {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
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
}
