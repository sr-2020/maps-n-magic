// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import * as R from 'ramda';

import './BeaconRecordCommunicator.css';

// import { BeaconRecordCommunicatorPropTypes } from '../../types';

import { BeaconRecordHolder } from './BeaconRecordHolder';
import { RemoteBeaconRecordHolder } from './RemoteBeaconRecordHolder';

export class BeaconRecordCommunicator extends Component {
  beaconRecords = [];
  // static propTypes = BeaconRecordCommunicatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
    // this.holder = new BeaconRecordHolder();
    this.holder = new RemoteBeaconRecordHolder();
    this.onPostBeaconRequested = this.onPostBeaconRequested.bind(this);
    this.onPutBeaconRecordRequested = this.onPutBeaconRecordRequested.bind(this);
    this.onDeleteBeaconRecordRequested = this.onDeleteBeaconRecordRequested.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);
    this.loadBeaconRecords();
    console.log('MockBeaconRecordCommunicator mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.loadBeaconRecords();
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
    clearTimeout(this.inputChangeTimeout);

    this.inputChangeTimeout = setTimeout(() => {
      this.holder.put({ id, props }).then((beaconRecord) => {
        const index = this.beaconRecords.findIndex((br) => br.id === id);
        this.beaconRecords[index] = beaconRecord;
        const {
          gameModel,
        } = this.props;
        gameModel.execute({
          type: 'putBeaconRecordConfirmed',
          beaconRecord,
        });
      }).catch(this.getErrorHandler('Error on beacon put'));
    }, 500);
  }

  onDeleteBeaconRecordRequested({ id }) {
    this.holder.delete({ id }).then(() => {
      const beaconRecord = this.beaconRecords.find((br) => br.id === id);
      this.beaconRecords = this.beaconRecords.filter((br) => br.id !== id);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: 'deleteBeaconRecordConfirmed',
        beaconRecord,
      });
    }).catch(this.getErrorHandler('Error on beacon delete'));
  }

  onPostBeaconRequested({ props }) {
    this.holder.post({ props }).then((beaconRecord) => {
      this.beaconRecords.push(beaconRecord);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: 'postBeaconRecordConfirmed',
        beaconRecord,
      });
    }).catch(this.getErrorHandler('Error on beacon post'));
  }

  loadBeaconRecords() {
    this.holder.get().then((beaconRecords) => {
      this.beaconRecords = beaconRecords;
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: 'setBeaconRecords',
        beaconRecords: R.clone(this.beaconRecords),
      });
    }).catch(this.getErrorHandler('Error on beacon loading'));
  }

  getErrorHandler(title) {
    return (err) => {
      console.error(err);
      const {
        gameModel,
      } = this.props;
      gameModel.execute({
        type: 'postNotification',
        title,
        message: err.message || err,
        kind: 'error',
      });
    };
  }

  render() {
    return null;
  }
}
