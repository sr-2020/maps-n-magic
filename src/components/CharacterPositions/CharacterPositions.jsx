import React, { Component } from 'react';
import './CharacterPositions.css';

import * as R from 'ramda';

import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { isGeoLocation } from '../../utils/miscUtils';

// import { CharacterPositionsPropTypes } from '../../types';

const REQUEST_TIMEOUT = 15000;

const userUrl = 'https://position.evarun.ru/api/v1/users';
const locationUrl = 'https://position.evarun.ru/api/v1/locations';


export class CharacterPositions extends Component {
  // static propTypes = CharacterPositionsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      users: null,
      locations: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.setLocationRecords = this.setLocationRecords.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);

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
    gameModel[action]('locationRecordsChanged', this.setLocationRecords);
  }

  setLocationRecords({ locationRecords }) {
    this.setState({
      locations: R.indexBy(R.prop('id'), locationRecords.filter(isGeoLocation)),
    });
  }

  onSubmit(e) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const rawCharacterId = form.characterId.value.trim();
    if (R.isEmpty(rawCharacterId)) {
      return;
    }

    const characterId = Number(rawCharacterId);
    const locationId = Number(form.locationId.value.trim());

    if (isNaN(characterId) || isNaN(locationId)) {
      return;
    }

    console.log(characterId, locationId);

    // const response = await fetch(`${this.url}/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8',
    //     'X-User-Id': 1,
    //   },
    //   body: JSON.stringify({
    //     ...props,
    //   }),
    // });
  }

  loadUsers() {
    fetch(userUrl)
      .then((result) => {
        if (!result.ok) throw new Error(result);
        return result.json();
      }).then((result) => {
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
    const { locations } = this.state;
    if (locations[locationId]) {
      return `${locations[locationId].label}(${locationId})`;
    }
    return 'N/A';
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { users, locations } = this.state;
    const { t } = this.props;

    const locations2 = R.sortBy(R.prop('label'), R.values(locations));

    if (!users || !locations) {
      return <div> Loading data... </div>;
    }
    return (
      <div className="CharacterPositions  tw-mx-8 tw-my-4">

        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="characterId">
            <Form.Label>{t('characterId')}</Form.Label>
            <Form.Control list="characterIdList" />
          </Form.Group>

          <Form.Group controlId="locationId">
            <Form.Label>{t('location')}</Form.Label>
            <Form.Control as="select">
              {
                locations2.map((location) => (
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
        <div>
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
      </div>
    );
  }
}
