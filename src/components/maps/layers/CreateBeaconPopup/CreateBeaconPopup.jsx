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

    const common = 'font-bold py-2 focus:outline-none focus:shadow-outline rounded';
    const selectedButton = 'bg-blue-500 hover:bg-blue-700 text-white';
    const unselectedButton = 'bg-gray-300 hover:bg-gray-400 text-gray-800';
    return (
      <div className="CreateBeaconPopup">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
                  className={classNames(common, unselectedButton, 'w-12 px-2 idSelectButton')}
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
              className={classNames('px-4', common, unselectedButton)}
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
