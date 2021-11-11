import React, { Component, FormEvent } from 'react';
import * as R from 'ramda';
import * as moment from 'moment-timezone';

import './RescueServiceMessageSender.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { 
  isGeoLocation, 
  UserRecord, 
  GameModel,
  LocationRecord,
  bodyConditionsList, 
  lifeStyleList, 
  BodyConditions,
  // PutCharHealth,
  EPutCharHealthRequested,
  LifeStylesValues
} from 'sr2020-mm-event-engine';

import { WithTranslation } from "react-i18next";
import { processForDisplay } from '../../i18n';

type BodyConditionsTKeys = `physicalBodyCondition_${Lowercase<keyof typeof BodyConditions>}`;

interface RescueServiceMessageSenderProps extends WithTranslation {
  gameModel: GameModel;
};

interface RescueServiceMessageSenderState {
  sortedLocationList: LocationRecord[] | null;
  users: UserRecord[] | null;
  locationIndex: Record<number, LocationRecord> | null;
};

// userRecords
// TODO reaplce gameModel subscription with data HOCs
export class RescueServiceMessageSender extends Component<RescueServiceMessageSenderProps, RescueServiceMessageSenderState> {
  constructor(props: RescueServiceMessageSenderProps) {
    super(props);
    this.state = {
      users: null,
      locationIndex: null,
      sortedLocationList: null,
    };
    this.setLocationRecords = this.setLocationRecords.bind(this);
    this.setUserRecords = this.setUserRecords.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);
    this.setLocationRecords({
      locationRecords: gameModel.get('locationRecords'),
    });
    this.setUserRecords({
      userRecords: gameModel.get('userRecords'),
    });
    console.log('RescueServiceMessageSender mounted');
  }

  componentDidUpdate(prevProps: RescueServiceMessageSenderProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.setLocationRecords({
        locationRecords: gameModel.get('locationRecords'),
      });
      this.setUserRecords({
        userRecords: gameModel.get('userRecords'),
      });
    }
    console.log('RescueServiceMessageSender did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('RescueServiceMessageSender will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  subscribe(action: 'on'|'off', gameModel: GameModel) {
    // gameModel[action]('beaconRecordsChanged', this.setBeaconRecords);
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
    gameModel[action]('userRecordsChanged', this.setUserRecords);
  }

  // eslint-disable-next-line react/sort-comp
  setUserRecords({ userRecords }: { userRecords: UserRecord[] }) {
    this.setState({
      users: R.sortBy(R.prop('id'), userRecords),
    });
  }

  setLocationRecords({ locationRecords }: { locationRecords: LocationRecord[] }) {
    const geoLocations = locationRecords.filter(isGeoLocation);
    this.setState({
      locationIndex: R.indexBy(R.prop('id'), geoLocations),
      sortedLocationList: R.sortBy(R.prop('label'), geoLocations),
    });
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    const {
      gameModel,
    } = this.props;
    const { sortedLocationList, users } = this.state;
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const data = new FormData(form);
    // for (const [name, value] of data) {
    //   console.log(`${name} = ${value}`);
    // }

    let characterId1 = data.get('characterId');
    if (R.isEmpty(characterId1)) {
      return;
    }
    const characterId = Number(characterId1);
    if (Number.isNaN(characterId) || !sortedLocationList || !users) {
      return;
    }

    const locationId = Number(data.get('locationId'));

    const location = sortedLocationList.find((el) => el.id === locationId);

    const user = users.find((el) => el.id === characterId);

    // gameModel.execute2<PutCharHealth>({
    gameModel.emit2<EPutCharHealthRequested>({
      type: 'putCharHealthRequested',
      characterId,
      characterHealthState: {
        locationId: locationId === -1 ? null : locationId,
        locationLabel: locationId === -1 || location === undefined ? 'N/A' : location.label,
        // @ts-ignore
        healthState: data.get('healthStateRadio'),
        timestamp: moment.utc().valueOf(),
        // @ts-ignore
        lifeStyle: data.get('lifeStyleRadio'),
        personName: user?.name || `id ${characterId}`,
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getUserNameStr(user: UserRecord): string {
    return user.name !== '' ? ` (${user.name})` : '';
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      users, locationIndex, sortedLocationList,
    } = this.state;
    const { t } = this.props;

    if (!users || !locationIndex || !sortedLocationList) {
      return <div> Loading data... </div>;
    }

    return (
      <div className="RescueServiceMessageSender tw-mx-8 tw-my-4">
        <Alert className="" variant="warning">
          {t('warningRescueServiceSenderIsSimulator')}
        </Alert>
        <Form
          className=""
          style={{ width: '30rem' }}
          onSubmit={this.onSubmit}
        >
          <Form.Group controlId="characterId">
            <Form.Label>{t('characterId')}</Form.Label>
            <Form.Control list="characterIdList" name="characterId" />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t('physicalBodyCondition')}</Form.Label>
            <div>
              <ToggleButtonGroup type="radio" name="healthStateRadio" defaultValue={bodyConditionsList[0]}>
                {
                  bodyConditionsList.map((value) => (
                    <ToggleButton
                      key={value}
                      value={value}
                    >
                      {t(`physicalBodyCondition_${value}` as BodyConditionsTKeys)}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>{t('characterlifeStyle')}</Form.Label>
            <div>
              <ToggleButtonGroup type="radio" name="lifeStyleRadio" defaultValue={lifeStyleList[0]}>
                {
                  lifeStyleList.map((value) => (
                    <ToggleButton
                      key={value}
                      value={value}
                    >
                      {t(value)}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>
            </div>
          </Form.Group>

          <Form.Group controlId="locationId">
            <Form.Label>{t('location')}</Form.Label>
            <Form.Control as="select" name="locationId">
              <option
                key="-1"
                value="-1"
              >
                {t('unknownLocation')}
              </option>
              {
                sortedLocationList.map((location) => (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {`${processForDisplay(location.label)} (${location.id})`}
                  </option>
                ))
              }
            </Form.Control>
          </Form.Group>
          <div className="tw-text-right">
            <Button variant="primary" type="submit">
              {t('sendRescueServiceMessage')}
            </Button>
          </div>
        </Form>
        {/* <datalist className="CharacterIdList" id="characterIdList">
          {
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.id + this.getUserNameStr(user)}
              </option>
            ))
          }
        </datalist> */}
      </div>
    );
  }
}
