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
import { CreateBeaconPopover } from './CreateBeaconPopover';

// import { BeaconRecordEditorPropTypes } from '../../types';

const sort = R.sortBy(R.prop('id'));

export class BeaconRecordEditor extends Component {
  // static propTypes = BeaconRecordEditorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      beaconRecords: [],
    };
    this.onPostBeaconRecord = this.onPostBeaconRecord.bind(this);
    this.onPutBeaconRecord = this.onPutBeaconRecord.bind(this);
    this.onDeleteBeaconRecord = this.onDeleteBeaconRecord.bind(this);
    this.onBeaconRecordsChanged = this.onBeaconRecordsChanged.bind(this);
    this.createBeacon = this.createBeacon.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

    this.setBeaconRecords({
      beaconRecords: sort(gameModel.get('beaconRecords')),
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
        beaconRecords: sort(gameModel.get('beaconRecords')),
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
    gameModel[action]('postBeaconRecord', this.onPostBeaconRecord);
    gameModel[action]('putBeaconRecord', this.onPutBeaconRecord);
    gameModel[action]('deleteBeaconRecord', this.onDeleteBeaconRecord);
    gameModel[action]('beaconRecordsChanged', this.onBeaconRecordsChanged);
  }

  setBeaconRecords({ beaconRecords }) {
    this.setState({
      beaconRecords,
    });
  }

  onBeaconRecordsChanged({ beaconRecords }) {
    this.setBeaconRecords({
      beaconRecords,
    });
  }

  onPutBeaconRecord({ beaconRecord }) {
    this.setState((state) => ({
      beaconRecords: state.beaconRecords.map((br) => (br.id === beaconRecord.id ? beaconRecord : br)),
    }));
  }

  onDeleteBeaconRecord({ beaconRecord }) {
    this.setState((state) => ({
      beaconRecords: state.beaconRecords.filter((br) => (br.id !== beaconRecord.id)),
    }));
  }

  onPostBeaconRecord({ beaconRecord }) {
    console.log('onPostBeaconRecord', beaconRecord.id);
    this.setState((state) => {
      const beaconRecords = sort([...state.beaconRecords, beaconRecord]);
      return {
        beaconRecords,
      };
    });
  }

  createBeacon(macAddress) {
    const { gameModel } = this.props;
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
      const { gameModel } = this.props;

      this.setState(({ beaconRecords }) => ({
        beaconRecords: beaconRecords.map((br) => (br.id === id ? ({
          ...br,
          [name]: value,
        }) : br)),
      }));

      // clearTimeout(this.inputChangeTimeout);

      // this.inputChangeTimeout = setTimeout(() => {
      gameModel.execute({
        type: 'putBeaconRecord',
        id,
        props: {
          [name]: value,
        },
      });
      // }, 200);
    };
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
    const { beaconRecords } = this.state;
    const { t } = this.props;

    if (!beaconRecords) {
      return null;
    }
    return (
      <div className="BeaconRecordEditor mx-8 my-4">
        <CreateBeaconPopover createBeacon={this.createBeacon} />

        <Table
          // bordered
          hover
          size="sm"
          className="w-auto"
          // style={{ width: '40rem' }}
        >
          <thead>
            <tr>
              <th className="text-right">{t('beaconId')}</th>
              <th>{t('beaconMacAddress')}</th>
              <th>{t('beaconLabel')}</th>
              {/* <th>{t('beaconPlacement')}</th> */}
            </tr>
          </thead>
          <tbody>

            {
              // eslint-disable-next-line max-lines-per-function
              beaconRecords.map((beacon) => (
                <tr>
                  <td className="text-right">{beacon.id}</td>
                  {/* <td>{beacon.bssid}</td> */}
                  <td>
                    <Form.Control
                      name="bssid"
                      type="text"
                      className="w-48 font-mono"
                      value={beacon.bssid}
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
                  {/* <td>{}</td> */}
                  <td>
                    <div className="menu float-right">
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
                            h-8
                            hover:bg-indigo-300
                            active:bg-indigo-600
                            focus:outline-none
                            focus:shadow-outline
                            active:bg-indigo-600
                            hover:opacity-100
                            focus:opacity-100
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
