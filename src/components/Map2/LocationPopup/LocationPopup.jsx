import React, { Component } from 'react';
import * as R from 'ramda';
import './LocationPopup.css';

export default class LocationPopup extends Component {
  state = {
    markerList: [],
    selectedAddMarker: null,
    selectedRemoveMarker: null,
  };

  componentDidMount = () => {
    console.log('LocationPopup mounted');
    this.updateComponentState();
  }

  componentDidUpdate = prevProps => {
    console.log('LocationPopup did update');
    const {
      name, allMarkers, attachedMarkers
    } = this.props;
    if (name === prevProps.name
      && R.equals(attachedMarkers, prevProps.attachedMarkers)
      && R.equals(allMarkers, prevProps.allMarkers)
    ) {
      return;
    }
    this.updateComponentState();
  }

  componentWillUnmount = () => {
    console.log('LocationPopup will unmount');
  }

  updateComponentState = () => {
    const {
      attachedMarkers, allMarkers
    } = this.props;
    const diff = R.difference(allMarkers, attachedMarkers);
    const diff2 = R.sortBy(R.toLower, diff);
    const attachedMarkers2 = R.sortBy(R.toLower, attachedMarkers);
    this.setState({
      markerList: diff2,
      selectedAddMarker: diff2.length > 0 ? diff2[0] : null,
      selectedRemoveMarker: attachedMarkers2.length > 0 ? attachedMarkers2[0] : null,
    });
  }

  removeMarker = e => {
    const {
      selectedRemoveMarker
    } = this.state;
    const {
      name, onLocMarkerChange
    } = this.props;
    if (!selectedRemoveMarker) {
      return;
    }
    onLocMarkerChange({
      locName: name,
      action: 'remove',
      markerName: selectedRemoveMarker
    });
  }

  addMarker = e => {
    const {
      selectedAddMarker
    } = this.state;
    const {
      name, onLocMarkerChange
    } = this.props;
    if (!selectedAddMarker) {
      return;
    }
    onLocMarkerChange({
      locName: name,
      action: 'add',
      markerName: selectedAddMarker
    });
  }

  onSelectedAddChange = e => {
    this.setState({
      selectedAddMarker: e.target.value
    });
  }

  onSelectedRemoveChange = e => {
    this.setState({
      selectedRemoveMarker: e.target.value
    });
  }

  _handleKeyDown = e => {
    console.log('do validate');
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      markerList, selectedAddMarker, selectedRemoveMarker
    } = this.state;
    const {
      name, onChange, attachedMarkers
    } = this.props;
    const attachedMarkers2 = R.sortBy(R.toLower, attachedMarkers);
    return (
      <div className="LocationPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="locationName"
          >Name
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
          >Markers
          </label>
          <div className="mb-2">
            {
              attachedMarkers2.map(markerName => <span className="mr-2">{markerName}</span>)
            }
            {
              attachedMarkers2.length === 0 && <span className="font-bold">No markers</span>
            }
          </div>
          <div className="mb-2">
            <select
              onChange={this.onSelectedAddChange}
              value={selectedAddMarker}
              className="marker-select shadow border rounded mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >{
                markerList.map(marker => <option>{marker}</option>)
              }
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.addMarker}
            >Add
            </button>
          </div>
          <div>
            <select
              onChange={this.onSelectedRemoveChange}
              value={selectedRemoveMarker}
              className="marker-select shadow border rounded mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >{
                attachedMarkers2.map(marker => <option>{marker}</option>)
              }
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={this.removeMarker}
            >Remove
            </button>
          </div>
        </div>
      </div>
    );
  }
}
