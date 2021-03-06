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

import { LocationRecord, BeaconRecord } from 'sr2020-mm-event-engine';

import { CreateBeaconPopover } from './CreateBeaconPopover';

interface BeaconRecordEditorProps {
  gameModel: any;
  t: any;
  beaconRecords: BeaconRecord[];
  sortedLocationList: LocationRecord[];
}

export class BeaconRecordEditor extends Component<BeaconRecordEditorProps> {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.createBeacon = this.createBeacon.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  createBeacon(macAddress: string): void {
    const { gameModel } = this.props;
    // console.log('createBeacon', this.state.beaconRecords.length);
    gameModel.execute({
      type: 'postBeaconRecord',
      props: { bssid: macAddress },
    });
  }

  handleInputChange(event): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const value = this.getTargetValue(target);
    const { name } = target;
    this.putBeaconRecord(Number(idStr), name, value);
  }

  onLocationSelect(event): void {
    const { value } = event.target;
    const { idStr } = event.target.dataset;
    const newValue = value === 'beaconHasNoLocation' ? null : Number(value);
    this.putBeaconRecord(Number(idStr), 'location_id', newValue);
  }

  putBeaconRecord(id, name, value): void {
    const { gameModel } = this.props;

    gameModel.execute({
      type: 'putBeaconRecord',
      id,
      props: {
        [name]: value,
      },
    });
  }

  removeBeacon(e, id): void {
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
    const { t, beaconRecords, sortedLocationList } = this.props;

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
                <tr key={beacon.id}>
                  <td className="tw-text-right">{beacon.id}</td>
                  {/* <td>{beacon.bssid}</td> */}
                  <td>
                    <Form.Control
                      name="bssid"
                      type="text"
                      className="tw-w-48 tw-font-mono"
                      defaultValue={beacon.bssid}
                      readOnly
                      data-id-str={beacon.id}
                      onChange={this.handleInputChange}
                    />

                  </td>
                  <td>
                    <Form.Control
                      name="label"
                      type="text"
                      style={{ width: '24rem' }}
                      defaultValue={beacon.label}
                      data-id-str={beacon.id}
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>
                    <Form.Control as="select" defaultValue={beacon.location_id} data-id-str={beacon.id} onChange={this.onLocationSelect}>
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
