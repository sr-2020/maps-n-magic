import React, { Component } from 'react';
import './BeaconRecordEditor.css';

// import { BeaconRecordEditorPropTypes } from '../../types';

export class BeaconRecordEditor extends Component {
  // static propTypes = BeaconRecordEditorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      beaconRecords: [],
    };
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

    this.setBeaconRecords({
      beaconRecords: gameModel.get('beaconRecords'),
    });
    console.log('BeaconRecordEditor mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.setBeaconRecords({
        beaconRecords: gameModel.get('beaconRecords'),
      });
      // this.setBeaconRecords();
    }
    console.log('BeaconRecordEditor did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('BeaconRecordEditor will unmount');
  }

  subscribe(action, gameModel) {
    // gameModel[action]('botUpdate', this.onBotUpdate);
  }

  setBeaconRecords({ beaconRecords }) {
    this.setState({
      beaconRecords,
    });
  }

  render() {
    const { beaconRecords } = this.state;
    // // const { t } = this.props;

    if (!beaconRecords) {
      return null;
    }
    return (
      <div className="BeaconRecordEditor">
        BeaconRecordEditor body
        {
          beaconRecords.map((beacon) => (
            <div>
              <span className="mr-2">{beacon.id}</span>
              <span className="mr-2">{beacon.ssid}</span>
              <span className="mr-2">{beacon.bssid}</span>
              <span className="mr-2">{beacon.label}</span>
            </div>
          ))
        }
      </div>
    );
  }
}
