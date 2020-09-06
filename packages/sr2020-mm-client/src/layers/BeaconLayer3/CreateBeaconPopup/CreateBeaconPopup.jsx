import React, { Component } from 'react';
import './CreateBeaconPopup.css';
import * as R from 'ramda';

import ReactDOM from 'react-dom';
import classNames from 'classnames';

// import { CreateBeaconPopupPropTypes } from '../../types';

export class CreateBeaconPopup extends Component {
  // static propTypes = CreateBeaconPopupPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('CreateBeaconPopup mounted');
  }

  componentDidUpdate() {
    console.log('CreateBeaconPopup did update');
  }

  componentWillUnmount() {
    console.log('CreateBeaconPopup will unmount');
  }

  makeContent() {
    const {
      t, onClose, freeBeaconIds, onSelect, latLng, curBeacon,
    } = this.props;

    const common = 'tw-font-bold tw-py-2 focus:tw-outline-none focus:tw-shadow-outline tw-rounded';
    const selectedButton = 'tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white';
    const unselectedButton = 'tw-bg-gray-300 hover:tw-bg-gray-400 tw-text-gray-800';
    return (
      <div className="CreateBeaconPopup">
        <div className="tw-mb-4">
          <label
            className="tw-block tw-text-gray-700 tw-text-sm tw-font-bold tw-mb-2"
            htmlFor="locationName"
          >
            {curBeacon
              ? t('selectBeaconIdForReplacing', { id: curBeacon.id })
              : t('selectBeaconId')}
          </label>
          <div className="idSelectContainer">
            {
              R.splitEvery(5)(freeBeaconIds.map((id) => (
                // className="mr-2 flex-auto"
                <button
                  type="button"
                  onClick={() => onSelect(latLng, id)}
                  className={classNames(common, unselectedButton, 'tw-w-12 tw-px-2 idSelectButton')}
                >
                  {id}
                </button>
              ))).map((arr) => <div className="idSelectRow">{arr}</div>)
            }
          </div>
          {/* <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="locationName"
            type="text"
            value={label}
            onChange={onChange('label')}
            onKeyPress={this._handleKeyDown}
          /> */}
          <div className="text-right">

            <button
              // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              className={classNames('tw-px-4', common, unselectedButton)}
              onClick={onClose}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { domContainer } = this.props;
    return ReactDOM.createPortal(
      this.makeContent(),
      domContainer,
    );
  }
}
