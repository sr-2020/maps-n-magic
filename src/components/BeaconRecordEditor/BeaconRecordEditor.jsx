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

// import { BeaconRecordEditorPropTypes } from '../../types';
import { classNames } from 'classnames';

const sort = R.sortBy(R.prop('id'));

export class BeaconRecordEditor extends Component {
  // static propTypes = BeaconRecordEditorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      beaconRecords: [],
    };
    this.handleBeaconSubmit = this.handleBeaconSubmit.bind(this);
    this.onPostBeaconRecord = this.onPostBeaconRecord.bind(this);
    this.onPutBeaconRecord = this.onPutBeaconRecord.bind(this);
    this.onDeleteBeaconRecord = this.onDeleteBeaconRecord.bind(this);
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
  }

  setBeaconRecords({ beaconRecords }) {
    this.setState({
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
    this.setState((state) => {
      const beaconRecords = sort([...state.beaconRecords, beaconRecord]);
      return {
        beaconRecords,
      };
    });
  }

  handleBeaconSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const { gameModel } = this.props;
      gameModel.execute({
        type: 'postBeaconRecord',
        props: { bssid: form.beaconMacAddress.value },
      });
      form.beaconMacAddress.value = '';
    }
  }

  handleInputChange(id) {
    return (event) => {
      const { target } = event;
      const value = this.getTargetValue(target);
      const { name } = target;
      const { gameModel } = this.props;

      gameModel.execute({
        type: 'putBeaconRecord',
        id,
        props: {
          [name]: value,
        },
      });
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

  getCreateBeaconPopover(t) {
    return (
      <Popover id="popover-basic">
        <Popover.Title as="h3">{t('enterBeaconProperties')}</Popover.Title>
        {/* <Popover.Title as="h3">{t('beaconMacAddress')}</Popover.Title> */}
        <Popover.Content>
          <Form onSubmit={this.handleBeaconSubmit}>
            {/* <Form.Group controlId="beaconId">
              <Form.Label>{t('beaconId')}</Form.Label>
              <Form.Control
                type="text"
                required
                ref={(el) => (this.newBeaconIdInput = el)}
              />
            </Form.Group> */}
            <Form.Group controlId="beaconMacAddress">
              {/* <Form.Label>{t('beaconMacAddress')}</Form.Label> */}
              <Form.Control
                type="text"
                required
                ref={(el) => (this.newBeaconMacInput = el)}
              />
            </Form.Group>
            <div className="text-right">
              <Button variant="primary" type="submit">
                {t('createBeacon')}
              </Button>
            </div>
          </Form>
        </Popover.Content>
      </Popover>
    );
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
        <OverlayTrigger
          trigger="click"
          placement="right"
          overlay={this.getCreateBeaconPopover(t)}
          rootClose
          rootCloseEvent="click"
        >
          <button
            type="button"
            className="tw-btn tw-btn-blue whitespace-no-wrap flex-grow-0 newSpiritButton mb-2"
            onClick={() => {
              setTimeout(() => {
                if (this.newBeaconMacInput) {
                  this.newBeaconMacInput.focus();
                }
              }, 50);
            }}
          >
            <FontAwesomeIcon className="fill-current w-4 h-4 mr-2" icon={faPlus} />
            <span>
              {t('newBeacon')}
            </span>
          </button>
        </OverlayTrigger>

        <Table
          bordered
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
                      className="w-40"
                      id="fractionInput"
                      value={beacon.bssid}
                      onChange={this.handleInputChange(beacon.id)}
                    />

                  </td>
                  <td>
                    <Form.Control
                      name="label"
                      type="text"
                      style={{ width: '24rem' }}
                      id="labelInput"
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
