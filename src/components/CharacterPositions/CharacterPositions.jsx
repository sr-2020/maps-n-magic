/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import './CharacterPositions.css';

import * as R from 'ramda';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { isGeoLocation } from '../../utils/miscUtils';

import { RemoteUsersRecordHolder, postUserPosition } from '../../api/position';

// import { CharacterPositionsPropTypes } from '../../types';

const REQUEST_TIMEOUT = 15000;

export class CharacterPositions extends Component {
  // static propTypes = CharacterPositionsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      users: null,
      locationIndex: null,
      sortedLocationList: null,
      beaconIndex: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.setLocationRecords = this.setLocationRecords.bind(this);
    this.setBeaconRecords = this.setBeaconRecords.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

    this.users = new RemoteUsersRecordHolder();

    this.setBeaconRecords({
      beaconRecords: (gameModel.get('beaconRecords')),
    });
    this.setLocationRecords({
      locationRecords: (gameModel.get('locationRecords')),
    });

    this.characterChangeIntervalId = setInterval(() => {
      this.loadUsers();
    }, REQUEST_TIMEOUT);
    this.loadUsers();
    console.log('CharacterPositions mounted');
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
    console.log('CharacterPositions did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    clearInterval(this.characterChangeIntervalId);
    console.log('CharacterPositions will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action, gameModel) {
    gameModel[action]('beaconRecordsChanged', this.setBeaconRecords);
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
  }

  setLocationRecords({ locationRecords }) {
    const geoLocations = locationRecords.filter(isGeoLocation);
    this.setState({
      locationIndex: R.indexBy(R.prop('id'), geoLocations),
      sortedLocationList: R.sortBy(R.prop('label'), geoLocations),
    });
  }

  // eslint-disable-next-line react/sort-comp
  setBeaconRecords({ beaconRecords }) {
    const makeIndex = R.pipe(
      R.filter(R.pipe(R.prop('location_id'), R.isNil, R.not)),
      R.indexBy(R.prop('location_id')),
    );
    const beaconIndex = makeIndex(beaconRecords);
    // console.log(beaconIndex);
    this.setState({
      beaconIndex,
    });
  }

  onSubmit(e) {
    const { beaconIndex } = this.state;
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const rawCharacterId = form.characterId.value.trim();
    if (R.isEmpty(rawCharacterId)) {
      return;
    }

    const characterId = Number(rawCharacterId);
    const locationId = Number(form.locationId.value.trim());

    if (Number.isNaN(characterId) || Number.isNaN(locationId) || !beaconIndex[locationId]) {
      return;
    }

    const beacon = beaconIndex[locationId];

    postUserPosition(characterId, beacon).then((result) => {
      if (!result.ok) throw new Error(result);
      this.loadUsers();
    }).catch((error) => {
      console.error(error);
    });
  }

  loadUsers() {
    this.users.get()
      .then((result) => {
        this.updateUsers(result);
      }).catch((error) => {
        console.error(error);
      });
  }

  updateUsers(users) {
    this.setState({
      users: R.sortBy(R.prop('id'), users),
    });
  }

  getLocationText(locationId) {
    const { locationIndex } = this.state;
    if (locationIndex[locationId]) {
      return `${locationIndex[locationId].label}(${locationId})`;
    }
    return 'N/A';
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      users, locationIndex, sortedLocationList, beaconIndex,
    } = this.state;
    const { t } = this.props;

    if (!users || !locationIndex || !beaconIndex) {
      return <div> Loading data... </div>;
    }

    const groupByHasBeacons = R.groupBy((loc) => (beaconIndex[loc.id] ? 'hasBeacons' : 'hasNoBeacons'));
    const { hasBeacons = [], hasNoBeacons = [] } = groupByHasBeacons(sortedLocationList);

    return (
      <div className="CharacterPositions  tw-mx-8 tw-my-4">
        <div className="tw-flex tw-items-start">


          <div>
            <Form
              className=""
              style={{ width: '30rem' }}
              onSubmit={this.onSubmit}
            >
              <Form.Group controlId="characterId">
                <Form.Label>{t('characterId')}</Form.Label>
                <Form.Control list="characterIdList" />
              </Form.Group>

              <Form.Group controlId="locationId">
                <Form.Label>{t('location')}</Form.Label>
                <Form.Control as="select">
                  {
                    hasBeacons.map((location) => (
                      <option
                        key={location.id}
                        value={location.id}
                      >
                        {`${location.label} (${location.id})`}
                      </option>
                    ))
                  }
                </Form.Control>
              </Form.Group>
              <div className="tw-text-right">
                <Button variant="primary" type="submit">
                  {t('moveCharacterToLocation')}
                </Button>
              </div>
            </Form>
            <Table
              // bordered
              hover
              size="sm"
              className="tw-w-auto"
              // style={{ width: '40rem' }}
            >
              <thead>
                <tr>
                  <th>{t('characterId')}</th>
                  <th>{t('location')}</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map((user) => (
                    <tr>
                      <td>{user.id}</td>
                      <td>{this.getLocationText(user.location_id)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>

            <datalist className="CharacterIdList" id="characterIdList">
              {
              // eslint-disable-next-line jsx-a11y/control-has-associated-label
                users.map((user) => <option key={user.id} value={user.id} />)
              }
            </datalist>
          </div>

          <Alert className="tw-ml-8" variant="warning">
            {t('locationHasNoBeaconsError')}
            <ul className="tw-list-disc tw-pl-8">
              {
                hasNoBeacons.map((loc) => <li key={loc.id}>{loc.label}</li>)
              }
            </ul>
          </Alert>
        </div>
      </div>
    );
  }
}
