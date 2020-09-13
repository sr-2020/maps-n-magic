import React, { Component } from 'react';
import './BeaconRecordEditor.css';
import * as R from 'ramda';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';

import Dropdown from 'react-bootstrap/Dropdown';

import { classNames } from 'classnames';
import { isGeoLocation } from 'sr2020-mm-event-engine/utils';
import { CreateBeaconPopover } from './CreateBeaconPopover';

// import { BeaconRecordEditorPropTypes } from '../../types';

const sortById = R.sortBy(R.prop('id'));

export class BeaconRecordEditor extends Component {
  // static propTypes = BeaconRecordEditorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      beaconRecords: [],
      sortedLocationList: null,
    };
    this.onPostBeaconRecord = this.onPostBeaconRecord.bind(this);
    this.onPutBeaconRecord = this.onPutBeaconRecord.bind(this);
    this.onDeleteBeaconRecord = this.onDeleteBeaconRecord.bind(this);
    this.setBeaconRecords = this.setBeaconRecords.bind(this);
    this.setLocationRecords = this.setLocationRecords.bind(this);
    this.createBeacon = this.createBeacon.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

    this.setBeaconRecords({
      beaconRecords: (gameModel.get('beaconRecords')),
    });
    this.setLocationRecords({
      locationRecords: (gameModel.get('locationRecords')),
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
        beaconRecords: (gameModel.get('beaconRecords')),
      });
      this.setLocationRecords({
        locationRecords: (gameModel.get('locationRecords')),
      });
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

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('postBeaconRecord', this.onPostBeaconRecord);
    gameModel[action]('putBeaconRecord', this.onPutBeaconRecord);
    gameModel[action]('deleteBeaconRecord', this.onDeleteBeaconRecord);
    gameModel[action]('beaconRecordsChanged', this.setBeaconRecords);
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
  }

  // eslint-disable-next-line react/sort-comp
  setBeaconRecords({ beaconRecords }) {
    // console.log('setBeaconRecords');
    this.setState({
      beaconRecords: sortById([...beaconRecords]),
    });
  }

  setLocationRecords({ locationRecords }) {
    const geoLocations = locationRecords.filter(isGeoLocation);
    this.setState({
      sortedLocationList: R.sortBy(R.prop('label'), geoLocations),
    });
  }

  onPutBeaconRecord({ beaconRecord }) {
    // console.log('onPutBeaconRecord', beaconRecord.id);
    this.setState((state) => ({
      beaconRecords: state.beaconRecords.map((br) => (br.id === beaconRecord.id ? beaconRecord : br)),
    }));
  }

  onDeleteBeaconRecord({ beaconRecord }) {
    // console.log('onDeleteBeaconRecord', beaconRecord.id);
    this.setState((state) => ({
      beaconRecords: state.beaconRecords.filter((br) => (br.id !== beaconRecord.id)),
    }));
  }

  onPostBeaconRecord({ beaconRecord }) {
    // console.log('onPostBeaconRecord', beaconRecord.id);
    this.setState((state) => {
      const beaconRecords = sortById([...state.beaconRecords, beaconRecord]);
      // console.log('onPostBeaconRecord', 'before', state.beaconRecords.length, 'after', beaconRecords.length);
      return {
        beaconRecords,
      };
    });
  }

  createBeacon(macAddress) {
    const { gameModel } = this.props;
    // console.log('createBeacon', this.state.beaconRecords.length);
    gameModel.execute({
      type: 'postBeaconRecord',
      props: { bssid: macAddress },
    });
  }

  handleInputChange(id) {
    return (event) => {
      const { target } = event;
      const value = this.getTargetValue(target);
      const { name } = target;
      this.putBeaconRecord(id, name, value);
    };
  }

  onLocationSelect(beaconId, e) {
    const { value } = e.target;
    const newValue = value === 'beaconHasNoLocation' ? null : Number(value);
    this.putBeaconRecord(beaconId, 'location_id', newValue);
  }

  putBeaconRecord(id, name, value) {
    const { gameModel } = this.props;

    this.setState(({ beaconRecords }) => ({
      beaconRecords: beaconRecords.map((br) => (br.id === id ? ({
        ...br,
        [name]: value,
      }) : br)),
    }));

    gameModel.execute({
      type: 'putBeaconRecord',
      id,
      props: {
        [name]: value,
      },
    });
  }

  removeBeacon(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const { gameModel } = this.props;
    gameModel.execute({
      type: 'deleteBeaconRecord',
      id,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetValue(target) {
    switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'number':
      return Number(target.value);
    default:
      return target.value;
    }
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { beaconRecords, sortedLocationList } = this.state;
    const { t } = this.props;

    if (!beaconRecords || !sortedLocationList) {
      return null;
    }
    // console.log(beaconRecords.length);
    return (
      <div className="BeaconRecordEditor tw-mx-8 tw-my-4">
        <CreateBeaconPopover createBeacon={this.createBeacon} />

        <Table
          // bordered
          hover
          size="sm"
          className="tw-w-auto"
          // style={{ width: '40rem' }}
        >
          <thead>
            <tr>
              <th className="tw-text-right">{t('beaconId')}</th>
              <th>{t('beaconMacAddress')}</th>
              <th>{t('beaconLabel')}</th>
              <th>{t('location')}</th>
              {/* <th>{t('beaconPlacement')}</th> */}
            </tr>
          </thead>
          <tbody>

            {
              // eslint-disable-next-line max-lines-per-function
              beaconRecords.map((beacon) => (
                <tr>
                  <td className="tw-text-right">{beacon.id}</td>
                  {/* <td>{beacon.bssid}</td> */}
                  <td>
                    <Form.Control
                      name="bssid"
                      type="text"
                      className="tw-w-48 tw-font-mono"
                      value={beacon.bssid}
                      readOnly
                      onChange={this.handleInputChange(beacon.id)}
                    />

                  </td>
                  <td>
                    <Form.Control
                      name="label"
                      type="text"
                      style={{ width: '24rem' }}
                      value={beacon.label}
                      onChange={this.handleInputChange(beacon.id)}
                    />
                  </td>
                  <td>
                    <Form.Control as="select" value={beacon.location_id} onChange={(e) => this.onLocationSelect(beacon.id, e)}>
                      <option value="beaconHasNoLocation">{t('beaconHasNoLocation')}</option>
                      {
                        sortedLocationList.map((location) => (
                          <option
                            key={location.id}
                            value={location.id}
                          >
                            {`${location.label} (${location.id})`}
                          </option>
                        ))
                      }
                    </Form.Control>
                  </td>
                  <td>
                    <div className="menu tw-float-right">
                      <Dropdown
                        onToggle={(isOpen, e) => {
                          if (e.stopPropagation) e.stopPropagation();
                          if (e.preventDefault) e.preventDefault();
                        }}
                      >
                        <Dropdown.Toggle className="
                            tw-btn
                            tw-btn-ghost
                            SpiritMenuButton
                            tw-h-8
                            hover:tw-bg-indigo-300
                            active:tw-bg-indigo-600
                            focus:tw-outline-none
                            focus:tw-shadow-outline
                            active:tw-bg-indigo-600
                            hover:tw-opacity-100
                            focus:tw-opacity-100
                            tw-dropdown-toggle
                          "
                        >
                          {t('actionMenu')}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            as="button"
                            onClick={(e) => this.removeBeacon(e, beacon.id)}
                          >
                            {t('delete')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
