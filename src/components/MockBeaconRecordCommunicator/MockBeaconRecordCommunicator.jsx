import React, { Component } from 'react';
import * as R from 'ramda';

import './MockBeaconRecordCommunicator.css';

const defaultBR = [
  {
    id: 10, ssid: 'EE:D2:A8:E2:1C:62', bssid: 'EE:D2:A8:E2:1C:62', location_id: 10, label: '10',
  }, {
    id: 11, ssid: 'FE:B1:7B:B6:2B:4A', bssid: 'FE:B1:7B:B6:2B:4A', location_id: 11, label: '11',
  }, {
    id: 12, ssid: 'FE:7B:B7:53:58:CB', bssid: 'FE:7B:B7:53:58:CB', location_id: 12, label: '12',
  }, {
    id: 13, ssid: 'CE:1B:0B:7F:5A:78', bssid: 'CE:1B:0B:7F:5A:78', location_id: 13, label: '13',
  }, {
    id: 14, ssid: 'DD:C3:4A:60:04:B2', bssid: 'DD:C3:4A:60:04:B2', location_id: 14, label: '14',
  },
];
// import { MockBeaconRecordCommunicatorPropTypes } from '../../types';

export class MockBeaconRecordCommunicator extends Component {
  // static propTypes = MockBeaconRecordCommunicatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);
    this.setBeaconRecords();
    console.log('MockBeaconRecordCommunicator mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.setBeaconRecords();
    }
    console.log('MockBeaconRecordCommunicator did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('MockBeaconRecordCommunicator will unmount');
  }

  subscribe(action, gameModel) {
    // gameModel[action]('botUpdate', this.onBotUpdate);
  }

  setBeaconRecords() {
    const {
      gameModel,
    } = this.props;
    gameModel.execute({
      type: 'setBeaconRecords',
      beaconRecords: R.clone(defaultBR),
    });
  }

  render() {
    return null;
  }
}
