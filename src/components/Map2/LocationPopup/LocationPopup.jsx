import React, { Component } from 'react';
import * as R from 'ramda';
import './LocationPopup.css';

import ReactDOM from 'react-dom';
import { LocationPopupPropTypes } from '../../../types';

import { locationPopupDom } from '../../../utils/domUtils';

export class LocationPopup extends Component {
  static propTypes = LocationPopupPropTypes;

  constructor() {
    super();
    this.state = {
      unattachedList: [],
      attachedList: [],
      selectedAddMarker: null,
      selectedRemoveMarker: null,
    };
  }

  componentDidMount = () => {
    this.updateComponentState();
  }

  componentDidUpdate = (prevProps) => {
    const {
      name, allBeacons, attachedMarkers,
    } = this.props;
    if (name === prevProps.name
      && R.equals(attachedMarkers, prevProps.attachedMarkers)
      && R.equals(allBeacons, prevProps.allBeacons)
    ) {
      return;
    }
    this.updateComponentState();
  }

  updateComponentState = () => {
    const {
      attachedMarkers, allBeacons, allLocations,
    } = this.props;

    const marker2loc = allLocations.reduce((acc, loc) => {
      loc.markers.forEach((marker) => (acc[marker] = loc.name));
      return acc;
    }, {});
    allBeacons.forEach((beacon) => (beacon.location = marker2loc[beacon.id]));
    const { attached, unattached } = R.groupBy((beacon) => (R.contains(beacon.id, attachedMarkers) ? 'attached' : 'unattached'), allBeacons);
    const comparator = R.comparator((a, b) => {
      if (!a.location && b.location) {
        return true;
      }
      if (a.location && !b.location) {
        return false;
      }
      return a.name.toLowerCase() < b.name.toLowerCase();
    });
    const unattached2 = R.sort(comparator, unattached || []);
    const sort = R.sortBy(R.pipe(R.prop('name'), R.toLower));
    const attached2 = sort(attached || []);
    this.setState({
      unattachedList: unattached2,
      attachedList: attached2,
      selectedAddMarker: unattached2.length > 0 ? unattached2[0].id : null,
      selectedRemoveMarker: attached2.length > 0 ? attached2[0].id : null,
    });
  }

  removeMarker = () => {
    const {
      selectedRemoveMarker,
    } = this.state;
    const {
      onLocMarkerChange,
    } = this.props;
    if (!selectedRemoveMarker) {
      return;
    }
    onLocMarkerChange({
      action: 'remove',
      markerId: selectedRemoveMarker,
    });
  }

  addMarker = () => {
    const {
      selectedAddMarker,
    } = this.state;
    const {
      onLocMarkerChange,
    } = this.props;
    if (!selectedAddMarker) {
      return;
    }
    onLocMarkerChange({
      action: 'add',
      markerId: selectedAddMarker,
    });
  }

  onSelectedAddChange = (e) => {
    this.setState({
      selectedAddMarker: Number(e.target.value),
    });
  }

  onSelectedRemoveChange = (e) => {
    this.setState({
      selectedRemoveMarker: Number(e.target.value),
    });
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  _getMarkerLabel = (marker) => {
    if (marker.location) {
      return `${marker.name} (${marker.location})`;
    }
    return marker.name;
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      unattachedList, attachedList, selectedAddMarker, selectedRemoveMarker,
    } = this.state;
    const {
      name, onChange,
    } = this.props;
    return (
      <div className="LocationPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="locationName"
          >
            Name
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
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="locationName"
          >
            Markers
          </label>
          <div className="mb-2">
            {
              attachedList.map((marker) => <span key={marker.id} className="mr-2">{marker.name}</span>)
            }
            {
              attachedList.length === 0 && <span className="font-bold">No markers</span>
            }
          </div>
          <div className="mb-2">
            <select
              onChange={this.onSelectedAddChange}
              value={selectedAddMarker || ''}
              className="marker-select shadow border rounded mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {
                unattachedList.map((marker) => <option key={marker.id} value={marker.id}>{this._getMarkerLabel(marker)}</option>)
              }
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.addMarker}
            >
              Add
            </button>
          </div>
          <div>
            <select
              onChange={this.onSelectedRemoveChange}
              value={selectedRemoveMarker || ''}
              className="marker-select shadow border rounded mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {
                attachedList.map((marker) => <option key={marker.id} value={marker.id}>{marker.name}</option>)
              }
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.removeMarker}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      this.makeContent(),
      locationPopupDom,
    );
  }
}
