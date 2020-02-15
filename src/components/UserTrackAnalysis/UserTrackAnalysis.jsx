import React, { Component } from 'react';
import './UserTrackAnalysis.css';
import * as R from 'ramda';

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { TimeRange } from './TimeRange';
import tracksData from '../../dataAnalysis/data/pt6.json';

import { RealTrackStats } from '../RealTrackStats';

const makeUserList = R.pipe(
  R.mapObjIndexed(R.path(['userData', 'name'])),
  R.toPairs,
  R.map(R.zipObj(['userId', 'userName'])),
);
const sortByName = R.sortBy(R.pipe(R.prop('userName'), R.toLower));
const userList = R.pipe(makeUserList, sortByName)(tracksData);

// import { UserTrackAnalysisPropTypes } from '../../types';

export class UserTrackAnalysis extends Component {
  // static propTypes = UserTrackAnalysisPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
      maxTime: null,
      timeDelta: null,
    };
    this.onUserSelect = this.onUserSelect.bind(this);
    this.onTimeRangeChange = this.onTimeRangeChange.bind(this);
  }

  componentDidMount() {
    const selectedUser = userList[10].userId;
    const userData = tracksData[selectedUser];
    this.setState({
      selectedUser,
      maxTime: userData.stats.maxTimeMillis,
      maxTimeBoundary: userData.stats.maxTimeMillis + (userData.stats.maxTimeMillis % 60000),
      minTimeBoundary: userData.stats.minTimeMillis - (userData.stats.minTimeMillis % 60000),
      timeDelta: userData.stats.maxTimeMillis - userData.stats.minTimeMillis,
    });
    console.log('UserTrackAnalysis mounted');
  }

  componentDidUpdate() {
    console.log('UserTrackAnalysis did update');
  }

  componentWillUnmount() {
    console.log('UserTrackAnalysis will unmount');
  }

  onUserSelect(e) {
    this.setState({
      selectedUser: e.target.value,
    });
  }

  onTimeRangeChange(e) {
    this.setState({
      timeDelta: e[1] - e[0],
      maxTime: e[1],
    });
    // console.log(e);
  }

  render() {
    const {
      selectedUser, maxTime, timeDelta, maxTimeBoundary, minTimeBoundary,
    } = this.state;
    if (!maxTime) {
      return null;
    }
    const { drawMap } = this.props;
    const userData = R.pick([selectedUser], tracksData);
    return (
      <div className="UserTrackAnalysis">
        <Form>
          <Form.Group className="px-4 py-2">
            <Form.Label className="text-right inline mr-2">
              Пользователь
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedUser}
              onChange={this.onUserSelect}
              style={{ width: '15rem' }}
              className="inline"
            >
              {
                userList.map(({ userId, userName }) => <option value={userId}>{`${userName} (${tracksData[userId].rawDataArr.length} точек)`}</option>)
              }
            </Form.Control>
          </Form.Group>
        </Form>
        <div className="m-8">
          <TimeRange
            values={[maxTime - timeDelta, maxTime]}
            onChange={this.onTimeRangeChange}
            max={maxTimeBoundary}
            min={minTimeBoundary}
            step={60000}
            tickStep={60000 * 60}
          />
        </div>
        <RealTrackStats tracksData={userData} />
        <div style={{ height: '100vh' }}>
          {drawMap({ userData })}
        </div>
      </div>
    );
  }
}
