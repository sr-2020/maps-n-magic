/* eslint-disable react/sort-comp */
import React, { ChangeEvent, Component, FormEvent, useState } from 'react';
import './CharacterPositions.css';

import * as R from 'ramda';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { 
  isGeoLocation, 
  getUserNameStr,
  BeaconRecord, 
  UserRecord, 
  LocationRecord,
  EReloadUserRecords
} from 'sr2020-mm-event-engine';

// TODO this call should be moved in event engine service
import { postUserPosition } from 'sr2020-mm-client-event-engine';
import { GameModel } from "sr2020-mm-event-engine";
import { WithTranslation } from "react-i18next";

import { CharacterDataList } from '../CharacterDataList';

type BeaconIndex = {[location_id: string]: BeaconRecord};
type LocationIndex = {[location_id: string]: LocationRecord};

interface CharacterPositionsProps extends WithTranslation {
  gameModel: GameModel;
};
interface CharacterPositionsState {
  users: UserRecord[] | null; 
  locationIndex: LocationIndex | null;
  sortedLocationList: LocationRecord[] | null;
  beaconIndex: BeaconIndex | null;
};


// const {
//   users, locationIndex, sortedLocationList, beaconIndex,
// } = this.state;
// const { t } = this.props;
// TODO This component uses old approach with direct data subscription.
// Current approach is using HOCs.
// Switch this component to HOCs if it is necessary.
export class CharacterPositions extends Component<CharacterPositionsProps, CharacterPositionsState> {

  constructor(props: CharacterPositionsProps) {
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
    this.setUserRecords = this.setUserRecords.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

    this.setBeaconRecords({
      beaconRecords: gameModel.get('beaconRecords') as BeaconRecord[],
    });
    this.setLocationRecords({
      locationRecords: gameModel.get('locationRecords'),
    });
    this.setUserRecords({
      userRecords: gameModel.get('userRecords'),
    });

    console.log('CharacterPositions mounted');
  }

  componentDidUpdate(prevProps: CharacterPositionsProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.setBeaconRecords({
        beaconRecords: gameModel.get('beaconRecords'),
      });
      this.setLocationRecords({
        locationRecords: gameModel.get('locationRecords'),
      });
      this.setUserRecords({
        userRecords: gameModel.get('userRecords'),
      });
    }
    console.log('CharacterPositions did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('CharacterPositions will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel) {
    gameModel[action]('beaconRecordsChanged', this.setBeaconRecords);
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
    gameModel[action]('userRecordsChanged', this.setUserRecords);
  }

  setLocationRecords( data: { locationRecords: LocationRecord[]} ) {
    const { locationRecords } = data;
    const geoLocations = locationRecords.filter(isGeoLocation);
    this.setState({
      locationIndex: R.indexBy(R.prop('id'), geoLocations),
      sortedLocationList: R.sortBy(R.prop('label'), geoLocations),
    });
  }

  // eslint-disable-next-line react/sort-comp
  setBeaconRecords(data: { beaconRecords: BeaconRecord[]} ) {
    const { beaconRecords } = data;
    type IndexFunction = (beaconRecords: BeaconRecord[]) => BeaconIndex;
    const makeIndex = R.pipe(
      R.filter(R.pipe(R.prop('location_id'), R.isNil, R.not)),
      R.indexBy(R.prop('location_id')),
    ) as IndexFunction;
    const beaconIndex = makeIndex(beaconRecords);
    // console.log(beaconIndex);
    this.setState({
      beaconIndex,
    });
  }

  setUserRecords({ userRecords }: {userRecords: UserRecord[]}) {
    this.setState({
      users: R.sortBy(R.prop('id'), userRecords),
    });
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    const {
      gameModel,
    } = this.props;
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

    if (Number.isNaN(characterId) || Number.isNaN(locationId) || !beaconIndex || !beaconIndex[locationId]) {
      return;
    }

    const beacon = beaconIndex[locationId];

    postUserPosition(characterId, beacon).then((result) => {
      if (!result.ok) throw new Error(result.toString());
      gameModel.emit2<EReloadUserRecords>({type: 'reloadUserRecords'});
    }).catch((error) => {
      console.error(error);
    });
  }

  getLocationText(locationId: number | null): string {
    const { locationIndex } = this.state;
    if (locationIndex !== null && locationId !== null && locationIndex[locationId]) {
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

    if (!users || !locationIndex || !beaconIndex || !sortedLocationList) {
      return <div> Loading data... </div>;
    }

    const groupByHasBeacons = R.groupBy((loc: LocationRecord) => (beaconIndex[loc.id] ? 'hasBeacons' : 'hasNoBeacons'));
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
                <CharacterInput users={users}/>
                {/* <Form.Control list="characterIdList" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text> */}
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
                      <td>{user.id + getUserNameStr(user)}</td>
                      <td>{this.getLocationText(user.location_id)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>

            <CharacterDataList users={users} />
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

interface CharacterInputProps {
  users: UserRecord[];
}

function CharacterInput(props: CharacterInputProps) {
  const { users } = props;
  const [charId, setCharId] = useState<number>(-1);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { target: { value } } = event;
    const id = Number(value);
    setCharId(Number.isNaN(id) ? -1 : id);
  }

  const user = users.find(user => user.id === charId);
  
  return (
    <>
      <Form.Control list="characterIdList" onChange={onChange}/>
      <Form.Text className="text-muted">
        {user?.location?.label ? `Персонаж в ${user?.location.label}` : 'Локация неизвестна'}
      </Form.Text>
    </>
  );
}