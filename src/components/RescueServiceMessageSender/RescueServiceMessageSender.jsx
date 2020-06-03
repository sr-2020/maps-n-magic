import React, { Component } from 'react';
import * as R from 'ramda';

import './RescueServiceMessageSender.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { putCharacterState } from '../../api/characterStates';

import { isGeoLocation } from '../../utils/miscUtils';

const bodyConditions = [
  'healthy',
  'wounded',
  'clinically_dead',
  'biologically_dead',
];

// import { RescueServiceMessageSenderPropTypes } from '../../types';

export class RescueServiceMessageSender extends Component {
  // static propTypes = RescueServiceMessageSenderPropTypes;

  constructor(props) {
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

  componentDidUpdate(prevProps) {
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
  subscribe(action, gameModel) {
    // gameModel[action]('beaconRecordsChanged', this.setBeaconRecords);
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
    gameModel[action]('userRecordsChanged', this.setUserRecords);
  }

  // eslint-disable-next-line react/sort-comp
  setUserRecords({ userRecords }) {
    this.setState({
      users: R.sortBy(R.prop('id'), userRecords),
    });
  }

  setLocationRecords({ locationRecords }) {
    const geoLocations = locationRecords.filter(isGeoLocation);
    this.setState({
      locationIndex: R.indexBy(R.prop('id'), geoLocations),
      sortedLocationList: R.sortBy(R.prop('label'), geoLocations),
    });
  }

  onSubmit(e) {
    const {
      gameModel,
    } = this.props;
    const { beaconIndex } = this.state;
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const data = new FormData(form);
    // for (const [name, value] of data) {
    //   console.log(`${name} = ${value}`);
    // }

    let characterId = data.get('characterId');
    if (R.isEmpty(characterId)) {
      return;
    }
    characterId = Number(characterId);
    if (Number.isNaN(characterId)) {
      return;
    }

    putCharacterState({
      characterId,
      locationId: Number(data.get('locationId')),
      healthState: data.get('healthStateRadio'),
    }).catch((error) => {
      console.error(error);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getUserNameStr(user) {
    return user.name !== '' ? ` (${user.name})` : '';
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      users, locationIndex, sortedLocationList,
    } = this.state;
    const { t } = this.props;

    if (!users || !locationIndex) {
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
              <ToggleButtonGroup type="radio" controlId="healthState" name="healthStateRadio" defaultValue={bodyConditions[0]}>
                {
                  bodyConditions.map((value) => (
                    <ToggleButton
                      key={value}
                      value={value}
                    >
                      {t(`physicalBodyCondition_${value}`)}
                    </ToggleButton>
                  ))
                }
              </ToggleButtonGroup>
            </div>
          </Form.Group>

          <Form.Group controlId="locationId">
            <Form.Label>{t('location')}</Form.Label>
            <Form.Control as="select" name="locationId">
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
          </Form.Group>
          <div className="tw-text-right">
            <Button variant="primary" type="submit">
              {t('sendRescueServiceMessage')}
            </Button>
          </div>
        </Form>
        <datalist className="CharacterIdList" id="characterIdList">
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
        </datalist>
      </div>
    );
  }
}
