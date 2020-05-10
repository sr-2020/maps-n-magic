import React, { Component } from 'react';
import './LocationPopup3.css';
import * as R from 'ramda';

import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { layerNameToLayerId, locationTypes } from '../LocationLayer3/LocationLayerTypes';

// import { LocationPopup3PropTypes } from '../../types';
// import { LocationLayer3 } from '../LocationLayer3/LocationLayer3';

export class LocationPopup3 extends Component {
  // static propTypes = LocationPopup3PropTypes;

  constructor(props) {
    super(props);
    this.state = {
      // unattachedList: [],
      // attachedList: [],
      // selectedAddMarker: null,
      // selectedRemoveMarker: null,
    };
  }

  componentDidMount = () => {
    // this.updateComponentState();
  }

  componentDidUpdate = (prevProps) => {
    const {
      label, allBeacons, attachedMarkers, manaLevel,
    } = this.props;
    // if (label === prevProps.label
    // // && manaLevel === prevProps.manaLevel
    // // && R.equals(attachedMarkers, prevProps.attachedMarkers)
    // // && R.equals(allBeacons, prevProps.allBeacons)
    // ) {

    // }
    // this.updateComponentState();
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    // const {
    //   // unattachedList, attachedList, selectedAddMarker, selectedRemoveMarker,
    // } = this.state;
    const {
      label, onChange, t, manaLevel, layer_id, color, weight, fillOpacity,
    } = this.props;

    const common = 'w-33p tw-font-bold tw-py-2 tw-px-4 focus:tw-outline-none focus:tw-shadow-outline';
    const selectedButton = 'tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white';
    const unselectedButton = 'tw-bg-gray-300 hover:tw-bg-gray-400 tw-text-gray-800';
    return (
      <div className="LocationPopup">
        <div className="tw-mb-4">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="locationName"
          >
            {t('locationName')}
          </label>
          <input
            className="tw-shadow tw-appearance-none tw-border tw-rounded tw-w-full tw-py-2 tw-px-3 tw-text-gray-700 tw-leading-tight focus:tw-outline-none focus:tw-shadow-outline"
            id="locationName"
            type="text"
            value={label}
            onChange={onChange('label')}
            onKeyPress={this._handleKeyDown}
          />
        </div>
        <div className="tw-mb-4">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="layer_id"
          >
            {t('locationType')}
          </label>

          <div className="tw-flex">
            {
              locationTypes.map((locationType, i) => (
                <button
                  key={locationType}
                  className={classNames(common,
                    layerNameToLayerId[locationType] === String(layer_id) ? selectedButton : unselectedButton,
                    {
                      'tw-rounded-l': i === 0,
                      'tw-rounded-r': i === 2,
                    })}
                  type="button"
                  value={layerNameToLayerId[locationType]}
                  onClick={onChange('layer_id')}
                >
                  {t(`locationType_${locationType}`)}
                </button>
              ))
            }
          </div>
        </div>
        <div className="tw-mb-4">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="layer_id"
          >
            {t('borderWidth')}
          </label>

          <div>
            {/* {
              locationTypes.map((locationType, i) => (
                <button
                  key={locationType}
                  className={classNames(common,
                    layerNameToLayerId[locationType] === String(layer_id) ? selectedButton : unselectedButton,
                    {
                      'rounded-l': i === 0,
                      'rounded-r': i === 2,
                    })}
                  type="button"
                  value={layerNameToLayerId[locationType]}
                  onClick={onChange('layer_id')}
                >
                  {t(`locationType_${locationType}`)}
                </button>
              ))
            } */}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { locationPopupDom } = this.props;
    return ReactDOM.createPortal(
      this.makeContent(),
      locationPopupDom,
    );
  }
}
