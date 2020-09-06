import React, { Component } from 'react';
import './LocationPopup3.css';
import * as R from 'ramda';

import ReactDOM from 'react-dom';
import classNames from 'classnames';

import FormControl from 'react-bootstrap/FormControl';
import { layerNameToLayerId, locationTypes } from '../LocationLayer3/LocationLayerTypes';

import { GOOGLE_MAPS_COLOR_PALETTE as COLOR_PALETTE } from 'sr2020-mm-client-core/utils/googleMapsColorPalette';


// console.log('COLOR_PALETTE', COLOR_PALETTE);
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
            {t('color')}
          </label>
          <div>
            <div className="tw-flex flex-wrap">
              {
                COLOR_PALETTE.map((colorObj) => (
                  // eslint-disable-next-line jsx-a11y/control-has-associated-label
                  <button
                    className={classNames('tw-relative color-button tw-w-4 tw-h-4 tw-flex-shrink-0 tw-border-transparent tw-border-2 tw-border-white', {
                      selected: colorObj.hex === color,
                    })}
                    style={{ backgroundColor: colorObj.hex }}
                    type="button"
                    onClick={() => onChange('color')({ target: { value: colorObj.hex } })}
                  />
                ))
              }
              {/* <FormControl
                type="range"
                value={Math.round((1 - fillOpacity) * 100)}
                min="0"
                max="100"
                step="1"
                onChange={onChange('fillOpacity')}
              />
              <FormControl
                type="number"
                className="tw-ml-4 tw-w-20"
                value={Math.round((1 - fillOpacity) * 100)}
                onChange={onChange('fillOpacity')}
              /> */}
            </div>
          </div>
        </div>
        <div className="tw-mb-4">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="layer_id"
          >
            {t('opacity')}
          </label>
          <div>
            <div className="tw-flex">
              <FormControl
                type="range"
                value={Math.round((1 - fillOpacity) * 100)}
                min="0"
                max="100"
                step="1"
                onChange={onChange('fillOpacity')}
              />
              <FormControl
                type="number"
                className="tw-ml-4 tw-w-20"
                value={Math.round((1 - fillOpacity) * 100)}
                onChange={onChange('fillOpacity')}
              />
            </div>
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
            <div className="tw-flex">
              <FormControl
                type="range"
                value={weight}
                min="0"
                max="20"
                step="1"
                onChange={onChange('weight')}
              />
              <FormControl
                type="number"
                className="tw-ml-4 tw-w-20"
                value={weight}
                onChange={onChange('weight')}
              />
            </div>
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
