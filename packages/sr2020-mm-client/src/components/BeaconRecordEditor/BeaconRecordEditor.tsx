import React, { 
  ChangeEvent, 
  Component, 
  ChangeEventHandler,
  MouseEvent 
} from 'react';
import './BeaconRecordEditor.css';
import * as R from 'ramda';

import Table from 'react-bootstrap/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';

// declare type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownItemProps } from 'react-bootstrap/DropdownItem';

import { 
  LocationRecord, 
  BeaconRecord, 
  GameModel,
  PostBeaconRecord,
  PutBeaconRecord,
  DeleteBeaconRecord,
  BeaconPropChange
} from 'sr2020-mm-event-engine';
import { WithTranslation } from "react-i18next";

import { CreateBeaconPopover } from './CreateBeaconPopover';
import { WithSortDataHOC } from "./SortDataHOC";
import { BeaconLocationSelect } from './BeaconLocationSelect';
import { Search } from '../EntityList/Search';

interface BeaconRecordEditorProps extends WithTranslation, WithSortDataHOC {
  gameModel: GameModel;
}
interface BeaconRecordEditorState {
  searchStr: string;
}

export class BeaconRecordEditor extends Component<BeaconRecordEditorProps, BeaconRecordEditorState> {
  updateBeaconRecordTimeoutId: NodeJS.Timeout | undefined;
  
  constructor(props: BeaconRecordEditorProps) {
    super(props);
    this.state = {
      searchStr: ''
    };
    this.createBeacon = this.createBeacon.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCoordChange = this.handleCoordChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(searchStr: string) {
    this.setState({
      searchStr,
    });
  }

  createBeacon(macAddress: string): void {
    const { gameModel } = this.props;
    // console.log('createBeacon', this.state.beaconRecords.length);
    gameModel.execute2<PostBeaconRecord>({
      type: 'postBeaconRecord',
      props: { bssid: macAddress },
    });
  }

  // handleInputChange(event: ChangeEvent<HTMLFormElement>): void {
  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const value = this.getTargetValue(target) as string;
    const name = target.name as 'bssid' | 'label';
    if(!['bssid','label'].includes(name)) {
      throw new Error('Unexpected beacon record prop name: ' + name);
    }
    this.putBeaconRecord(Number(idStr), {prop: name, value});
  }

  handleCoordChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const { idStr } = event.target.dataset;
    const { value } = target;
    const name = target.name as 'lat' | 'lng';
    if(!['lat','lng'].includes(name)) {
      throw new Error('Unexpected beacon record prop name: ' + name);
    }
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      console.error(`Coord value is not a number: ${value}`)
      return;
    }
    this.putBeaconRecord(Number(idStr), {prop: name, value: numberValue});
  }

  onLocationSelect(event: ChangeEvent<HTMLSelectElement>): void {
    const { value } = event.target;
    const { idStr } = event.target.dataset;
    const newValue = value === 'beaconHasNoLocation' ? null : Number(value);
    this.putBeaconRecord(Number(idStr), {prop: 'location_id', value: newValue});
  }

  // putBeaconRecord(id: number, name: string, value: null | number | boolean | string): void {
  putBeaconRecord(id: number, propChange: BeaconPropChange): void {
    const { gameModel } = this.props;

    if (this.updateBeaconRecordTimeoutId !== undefined) {
      clearTimeout(this.updateBeaconRecordTimeoutId);
    }

    this.updateBeaconRecordTimeoutId = setTimeout(() => {
      gameModel.execute2<PutBeaconRecord>({
        type: 'putBeaconRecord',
        id,
        props: {
          [propChange.prop]: propChange.value,
        },
      });
    }, 500);
  }

  removeBeacon(e: MouseEvent<DropdownItemProps>, id: number): void {
    e.preventDefault();
    e.stopPropagation();
    const { gameModel } = this.props;
    gameModel.execute2<DeleteBeaconRecord>({
      type: 'deleteBeaconRecord',
      id,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetValue(target: HTMLInputElement): boolean | number | string {
    switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'number':
      return Number(target.value);
    default:
      return target.value;
    }
  }

  filterBeaconRecords(beaconRecords: BeaconRecord[]): BeaconRecord[] {
    const { searchStr } = this.state; 
    if (searchStr === '') {
      return beaconRecords;
    }
    const lowerSearchStr = searchStr.toLowerCase();
    return beaconRecords.filter(beaconRecord => {

      return String(beaconRecord.id).includes(lowerSearchStr)
        || beaconRecord.bssid.toLowerCase().includes(lowerSearchStr)
        || beaconRecord.ssid.toLowerCase().includes(lowerSearchStr)
        || beaconRecord.label.toLowerCase().includes(lowerSearchStr)
      ;
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { t, beaconRecords, sortedLocationList, gameModel } = this.props;

    if (!beaconRecords || !sortedLocationList) {
      return null;
    }
    const filteredBeaconRecords = this.filterBeaconRecords(beaconRecords);
    // console.log(beaconRecords.length);
    return (
      <div className="BeaconRecordEditor tw-px-8 tw-py-4 tw-h-full tw-overflow-auto">
        <div className="tw-flex">
          <div className="tw-mr-8">
            <Search
              onSearchChange={this.onSearchChange}
            />
          </div>
          <div>
            <CreateBeaconPopover createBeacon={this.createBeacon} />
          </div>
        </div>
        

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
              <th>{t('latitude')}</th>
              <th>{t('longitude')}</th>
              {/* <th>{t('beaconPlacement')}</th> */}
            </tr>
          </thead>
          <tbody>

            {
              // eslint-disable-next-line max-lines-per-function
              filteredBeaconRecords.map((beacon) => (
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
                    <BeaconLocationSelect
                      gameModel={gameModel}
                      beacon={beacon}
                      onLocationSelect={(beaconId: number, locationId: number | null) => {
                        this.putBeaconRecord(beaconId, {prop: 'location_id', value: locationId});
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      name="lat"
                      type="text"
                      style={{ width: '10rem' }}
                      defaultValue={beacon.lat !== null ? beacon.lat : ''}
                      data-id-str={beacon.id}
                      disabled={beacon.lat === null}
                      onChange={this.handleCoordChange}
                    />
                  </td>
                  <td>
                    <Form.Control
                      name="lng"
                      type="text"
                      style={{ width: '10rem' }}
                      defaultValue={beacon.lng !== null ? beacon.lng : ''}
                      data-id-str={beacon.id}
                      disabled={beacon.lng === null}
                      onChange={this.handleCoordChange}
                    />
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
                            EntityMenuButton
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
                            onClick={(e: MouseEvent<DropdownItemProps>) => this.removeBeacon(e, beacon.id)}
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
