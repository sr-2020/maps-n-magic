import React, { Component } from 'react';
import './ManaOceanSettings.css';

// import { ManaOceanSettingsPropTypes } from '../../types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { prop } from 'ramda';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
  { name: 1, cost: 4.11, impression: 100 },
  { name: 2, cost: 2.39, impression: 120 },
  { name: 3, cost: 1.37, impression: 150 },
  { name: 4, cost: 1.16, impression: 180 },
  { name: 5, cost: 2.29, impression: 200 },
  { name: 6, cost: 3, impression: 499 },
  { name: 7, cost: 0.53, impression: 50 },
  { name: 8, cost: 2.52, impression: 100 },
  { name: 9, cost: 1.79, impression: 200 },
  { name: 10, cost: 2.94, impression: 222 },
  { name: 11, cost: 4.3, impression: 210 },
  { name: 12, cost: 4.41, impression: 300 },
  { name: 13, cost: 2.1, impression: 50 },
  { name: 14, cost: 8, impression: 190 },
  { name: 15, cost: 0, impression: 300 },
  { name: 16, cost: 9, impression: 400 },
  { name: 17, cost: 3, impression: 200 },
  { name: 18, cost: 2, impression: 50 },
  { name: 19, cost: 3, impression: 100 },
  { name: 20, cost: 7, impression: 100 },
  { name: 21, cost: 7 },
  { name: 22, impression: 100 },
];

const TIME_STEP = 10;

export class ManaOceanSettings extends Component {
  // static propTypes = ManaOceanSettingsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      neutralManaLevel: 3,
      visibleMoonPeriod: 180, // minutes
      visibleMoonNewMoonTime: 0,
      visibleMoonManaTideHeight: 1,
      invisibleMoonPeriod: 270,
      invisibleMoonNewMoonTime: 0,
      invisibleMoonManaTideHeight: 1,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    console.log('ManaOceanSettings mounted');
  }

  componentDidUpdate() {
    console.log('ManaOceanSettings did update');
  }

  componentWillUnmount() {
    console.log('ManaOceanSettings will unmount');
  }

  onChange(e, propName) {
    let { value } = e.target;
    value = Number(value);
    if (Number.isNaN(value)) {
      return;
    }
    switch (propName) {
    case 'neutralManaLevel':
    case 'visibleMoonManaTideHeight':
    case 'invisibleMoonManaTideHeight':
      if (value <= 0) {
        return;
      }
      break;
    case 'visibleMoonPeriod':
    case 'invisibleMoonPeriod':
      if (value <= 0) {
        return;
      }
      break;
    case 'visibleMoonNewMoonTime':
    case 'invisibleMoonNewMoonTime':
      break;
    default:
      throw new Error(`Unexpected propName: ${propName}`);
    }
    this.setState({
      [propName]: value,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      neutralManaLevel,
      visibleMoonPeriod,
      visibleMoonNewMoonTime,
      visibleMoonManaTideHeight,
      invisibleMoonPeriod,
      invisibleMoonNewMoonTime,
      invisibleMoonManaTideHeight,
    } = this.state;
    const { t } = this.props;

    return (
      <div className="ManaOceanSettings">
        <div className="tw-flex">
          <Form.Group className="tw-m-4">
            <Form.Label>{t('neutralManaLevel')}</Form.Label>
            <Form.Control
              type="number"
              value={neutralManaLevel}
              onChange={(e) => this.onChange(e, 'neutralManaLevel')}
            />
          </Form.Group>

          <Table className="tw-m-4" size="sm">
            <thead>
              <tr>
                <th>{t('moonName')}</th>
                <th>{t('moonPeriod_min')}</th>
                <th>{t('newMoonTime_min')}</th>
                <th>{t('manaTideHeight')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {t('visibleMoon')}
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step={TIME_STEP}
                    value={visibleMoonPeriod}
                    onChange={(e) => this.onChange(e, 'visibleMoonPeriod')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step={TIME_STEP}
                    value={visibleMoonNewMoonTime}
                    onChange={(e) => this.onChange(e, 'visibleMoonNewMoonTime')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={visibleMoonManaTideHeight}
                    onChange={(e) => this.onChange(e, 'visibleMoonManaTideHeight')}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  {t('invisibleMoon')}
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step={TIME_STEP}
                    value={invisibleMoonPeriod}
                    onChange={(e) => this.onChange(e, 'invisibleMoonPeriod')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step={TIME_STEP}
                    value={invisibleMoonNewMoonTime}
                    onChange={(e) => this.onChange(e, 'invisibleMoonNewMoonTime')}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={invisibleMoonManaTideHeight}
                    onChange={(e) => this.onChange(e, 'invisibleMoonManaTideHeight')}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <LineChart
            width={800}
            height={400}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
            <YAxis dataKey="value" /> */}

            <XAxis
              // allowDataOverflow
              dataKey="name"
              // domain={[left, right]}
              type="number"
            />
            <YAxis
              // allowDataOverflow
              // domain={[bottom, top]}
              type="number"
              // yAxisId="1"
            />
            <Tooltip />
            <Legend />
            <Line
              // yAxisId="1"
              type="natural"
              dataKey="cost"
              stroke="#8884d8"
              // animationDuration={300}
            />
            <Line
              // yAxisId="2"
              type="natural"
              dataKey="impression"
              stroke="#82ca9d"
              // animationDuration={300}
            />

            {/* {series.map((s) => (
              <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
            ))} */}
          </LineChart>
        </div>
      </div>
    );
  }
}
