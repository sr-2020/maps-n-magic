import React, { Component, KeyboardEvent } from 'react';
import './LocationPopup3.css';
import * as R from 'ramda';

import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { WithTranslation } from "react-i18next";

import FormControl from 'react-bootstrap/FormControl';
import { locationTypeSequence, locationTypeToTypeTkey } from '../LocationLayerTypes';

import { GOOGLE_MAPS_COLOR_PALETTE as COLOR_PALETTE } from 'sr2020-mm-client-core';

// console.log('COLOR_PALETTE', COLOR_PALETTE);

export type EditableLocFields = 'label' | 'layer_id' | 'color' | 'fillOpacity' | 'weight';

interface LocationPopup3Props extends WithTranslation {
  locationPopupDom: HTMLElement;
  onChange: (prop: EditableLocFields) => (e: {target: {value: string}}) => void;
  label: string;
  layer_id: number;
  color: string;
  weight: number;
  fillOpacity: number;
  onClose: () => void;
}

export class LocationPopup3 extends Component<
  LocationPopup3Props
> {

  constructor(props: LocationPopup3Props) {
    super(props);
    this.state = {
      // unattachedList: [],
      // attachedList: [],
      // selectedAddMarker: null,
      // selectedRemoveMarker: null,
    };
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  _handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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
      label, onChange, t, layer_id, color, weight, fillOpacity,
    } = this.props;

    const common = 'w-33p tw-font-bold tw-py-2 tw-px-4 focus:tw-outline-none focus:tw-shadow-outline';
    const selectedButton = 'tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white';
    const unselectedButton = 'tw-bg-gray-300 hover:tw-bg-gray-400 tw-text-gray-800';
    return (
      <div className="LocationPopup3">
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
              locationTypeSequence.map((locationType, i) => (
                <button
                  key={locationType.name}
                  className={classNames(common,
                    locationType.id === layer_id ? selectedButton : unselectedButton,
                    {
                      'tw-rounded-l': i === 0,
                      'tw-rounded-r': i === 2,
                    })}
                  type="button"
                  // value={locationType.id}
                  // onClick={onChange('layer_id')}
                  onClick={() => onChange('layer_id')({ target: { value: String(locationType.id) } })}
                >
                  {
                    t(locationTypeToTypeTkey(locationType.name))
                  }
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
