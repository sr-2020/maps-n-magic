import React, { Component } from 'react';
import * as R from 'ramda';

import './MockBeaconRecordCommunicator.css';

// import { MockBeaconRecordCommunicatorPropTypes } from '../../types';

const defaultBeaconRecord = {
  ssid: '',
  bssid: '',
  location_id: null,
  label: '',
};

export class MockBeaconRecordCommunicator extends Component {
  defaultBR = [
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
  // static propTypes = MockBeaconRecordCommunicatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onPostBeaconRequested = this.onPostBeaconRequested.bind(this);
    this.onPutBeaconRecordRequested = this.onPutBeaconRecordRequested.bind(this);
    this.onDeleteBeaconRecordRequested = this.onDeleteBeaconRecordRequested.bind(this);
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

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('postBeaconRecordRequested', this.onPostBeaconRequested);
    gameModel[action]('putBeaconRecordRequested', this.onPutBeaconRecordRequested);
    gameModel[action]('deleteBeaconRecordRequested', this.onDeleteBeaconRecordRequested);
  }

  onPutBeaconRecordRequested({ id, props }) {
    const index = this.defaultBR.findIndex((br) => br.id === id);
    const beaconRecord = {
      ...this.defaultBR[index],
      ...props,
    };
    this.defaultBR[index] = beaconRecord;
    const {
      gameModel,
    } = this.props;
    gameModel.execute({
      type: 'putBeaconRecordConfirmed',
      beaconRecord,
    });
  }

  onDeleteBeaconRecordRequested({ id }) {
    const index = this.defaultBR.findIndex((br) => br.id === id);
    const beaconRecord = this.defaultBR[index];
    this.defaultBR = this.defaultBR.filter((br) => br.id !== id);
    const {
      gameModel,
    } = this.props;
    gameModel.execute({
      type: 'deleteBeaconRecordConfirmed',
      beaconRecord,
    });
  }

  onPostBeaconRequested({ props }) {
    const maxId = this.getMaxId();
    const beaconRecord = {
      ...defaultBeaconRecord,
      ...props,
      id: maxId + 1,
    };
    this.defaultBR.push(beaconRecord);
    const {
      gameModel,
    } = this.props;
    gameModel.execute({
      type: 'postBeaconRecordConfirmed',
      beaconRecord,
    });
  }

  getMaxId() {
    if (R.isEmpty(this.defaultBR)) {
      return 1;
    }
    if (R.length(this.defaultBR) === 1) {
      return this.defaultBR.id;
    }
    return R.reduce(R.max, R.head(this.defaultBR).id, R.pluck('id', this.defaultBR));
  }

  setBeaconRecords() {
    const {
      gameModel,
    } = this.props;
    gameModel.execute({
      type: 'setBeaconRecords',
      beaconRecords: R.clone(this.defaultBR),
    });
  }

  render() {
    return null;
  }
}
