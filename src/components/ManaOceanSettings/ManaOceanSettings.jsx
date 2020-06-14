import React, { Component } from 'react';
import './ManaOceanSettings.css';
import * as R from 'ramda';
import * as moment from 'moment-timezone';

// import { ManaOceanSettingsPropTypes } from '../../types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { prop } from 'ramda';

import { TideChart } from './TideChart';

import {
  getMoonActivity, mergeActivities, fullDay, collectStatistics,
} from './moonActivityUtils';

const TIME_STEP = 10;

function formatMinutesStats(minutes) {
  return (minutes / 60).toFixed(1);
}

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
      invisibleMoonNewMoonTime: 120,
      invisibleMoonManaTideHeight: 1,
      moscowTime: 0,
    };
    this.onChange = this.onChange.bind(this);
    this.onUpdateMoscowTime = this.onUpdateMoscowTime.bind(this);
  }

  componentDidMount() {
    this.moscowTimeUpdater = setInterval(this.onUpdateMoscowTime, 1000);
    // this.moscowTimeUpdater = setInterval(this.onUpdateMoscowTime, 100);
    console.log('ManaOceanSettings mounted');
  }

  componentDidUpdate() {
    console.log('ManaOceanSettings did update');
  }

  componentWillUnmount() {
    clearInterval(this.moscowTimeUpdater);
    console.log('ManaOceanSettings will unmount');
  }

  onUpdateMoscowTime() {
    const msk = moment().tz('Europe/Moscow');

    const newMoscowTime = msk.hour() * 60 + msk.minute();

    this.setState((prevState) => (prevState.moscowTime === newMoscowTime ? null : {
      moscowTime: msk.hour() * 60 + msk.minute(),
      // moscowTime: (((msk.minute() * 60) + msk.seconds()) * 10) % fullDay,
    }));
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
      moscowTime,
    } = this.state;
    const { t } = this.props;

    const visibleMoonActivity = getMoonActivity(visibleMoonPeriod, visibleMoonNewMoonTime);
    const invisibleMoonActivity = getMoonActivity(invisibleMoonPeriod, invisibleMoonNewMoonTime);
    const mergedActivities = mergeActivities(visibleMoonActivity, invisibleMoonActivity);

    const series = [{
      chartName: t('tideTimetable'),
      seriesName: t('tideHeight'),
      data: mergedActivities,
      yDomain: [-2, 2],
      yTicks: R.range(-2, 3),
    }, {
      chartName: t('visibleMoon'),
      seriesName: t('tideHeight'),
      data: visibleMoonActivity,
      yDomain: [-1, 1],
      yTicks: R.range(-1, 2),
    }, {
      chartName: t('invisibleMoon'),
      seriesName: t('tideHeight'),
      data: invisibleMoonActivity,
      yDomain: [-1, 1],
      yTicks: R.range(-1, 2),
    }];

    const statistics = collectStatistics(mergedActivities);

    const timeSum = R.sum(R.values(statistics));

    return (
      <div className="ManaOceanSettings">
        <div className="tw-flex">
          {/* <Form.Group className="tw-m-4">
            <Form.Label>{t('neutralManaLevel')}</Form.Label>
            <Form.Control
              type="number"
              value={neutralManaLevel}
              onChange={(e) => this.onChange(e, 'neutralManaLevel')}
            />
          </Form.Group> */}
          <div>
            <h2 className="tw-text-xl tw-m-4">{t('moonParameters')}</h2>
            <Table className="tw-m-4 tw-w-auto" size="sm">
              <thead>
                <tr>
                  <th>{t('moonName')}</th>
                  <th className="tw-text-right">{t('moonPeriod_min')}</th>
                  <th style={{ maxWidth: '14rem' }} className="tw-text-right">{t('newMoonTime_min')}</th>
                  {/* <th>{t('manaTideHeight')}</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {t('visibleMoon')}
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={visibleMoonPeriod}
                      className="tw-w-24 tw-text-right"
                      onChange={(e) => this.onChange(e, 'visibleMoonPeriod')}
                    />
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={visibleMoonNewMoonTime}
                      className="tw-w-24 tw-text-right"
                      onChange={(e) => this.onChange(e, 'visibleMoonNewMoonTime')}
                    />
                  </td>
                  {/* <td>
                  <Form.Control
                    type="number"
                    value={visibleMoonManaTideHeight}
                    onChange={(e) => this.onChange(e, 'visibleMoonManaTideHeight')}
                  />
                </td> */}
                </tr>
                <tr>
                  <td>
                    {t('invisibleMoon')}
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={invisibleMoonPeriod}
                      className="tw-w-24 tw-text-right"
                      onChange={(e) => this.onChange(e, 'invisibleMoonPeriod')}
                    />
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={invisibleMoonNewMoonTime}
                      className="tw-w-24 tw-text-right"
                      onChange={(e) => this.onChange(e, 'invisibleMoonNewMoonTime')}
                    />
                  </td>
                  {/* <td>
                  <Form.Control
                    type="number"
                    value={invisibleMoonManaTideHeight}
                    onChange={(e) => this.onChange(e, 'invisibleMoonManaTideHeight')}
                  />
                </td> */}
                </tr>
              </tbody>
            </Table>
          </div>
          <div>
            <h2 className="tw-text-xl tw-m-4">{t('statisticsByTime')}</h2>
            <Table className="tw-m-4 tw-w-auto" size="sm">
              <tbody>
                <tr>
                  <td>{t('tideLevel')}</td>
                  <td className="tw-w-8 tw-text-right">-2</td>
                  <td className="tw-w-8 tw-text-right">-1</td>
                  <td className="tw-w-8 tw-text-right">0</td>
                  <td className="tw-w-8 tw-text-right">1</td>
                  <td className="tw-w-8 tw-text-right">2</td>
                </tr>
                <tr>
                  <td>{t('timeSum')}</td>
                  <td className="tw-w-4 tw-text-right">{formatMinutesStats(statistics[-2])}</td>
                  <td className="tw-w-4 tw-text-right">{formatMinutesStats(statistics[-1])}</td>
                  <td className="tw-w-4 tw-text-right">{formatMinutesStats(statistics[0])}</td>
                  <td className="tw-w-4 tw-text-right">{formatMinutesStats(statistics[1])}</td>
                  <td className="tw-w-4 tw-text-right">{formatMinutesStats(statistics[2])}</td>
                </tr>
                <tr>
                  <td>{t('timeSumTotal')}</td>
                  <td>{formatMinutesStats(timeSum)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
        <div>
          {series.map((s) => (
            <TideChart
              yDomain={s.yDomain}
              yTicks={s.yTicks}
              data={s.data}
              chartName={s.chartName}
              seriesName={s.seriesName}
              className="tw-mb-8"
              moscowTime={moscowTime}
            />
          ))}
        </div>
      </div>
    );
  }
}
