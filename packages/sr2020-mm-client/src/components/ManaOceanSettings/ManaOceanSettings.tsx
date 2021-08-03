import { WithTranslation } from 'react-i18next';
import React, { Component, ChangeEvent } from 'react';
import './ManaOceanSettings.css';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { prop } from 'ramda';

import {
  getMoonActivity, 
  mergeActivities, 
  collectStatistics, 
  getMoscowTime,
  TidePeriodProps,
  ManaOceanSettingsData,
  GameModel
} from 'sr2020-mm-event-engine';

import { WithManaOceanSettings } from '../../dataHOCs';

import { TideChart } from './TideChart';
import { Series } from './TideChart/TideChart';

const TIME_STEP = 10;

function formatMinutesStats(minutes: number): string {
  return (minutes / 60).toFixed(1);
}

interface ManaOceanSettingsProps extends WithTranslation, WithManaOceanSettings {
  gameModel: GameModel; 
}
interface ManaOceanSettingsState {
  moscowTime: number;
}

export class ManaOceanSettings extends Component<
  ManaOceanSettingsProps, ManaOceanSettingsState> {
  moscowTimeUpdater: NodeJS.Timeout;

  constructor(props: ManaOceanSettingsProps) {
    super(props);
    this.state = {
      // neutralManaLevel: 3,
      // visibleMoonPeriod: 180, // minutes
      // visibleMoonNewMoonTime: 0,
      // visibleMoonManaTideHeight: 1,
      // invisibleMoonPeriod: 270,
      // invisibleMoonNewMoonTime: 120,
      // invisibleMoonManaTideHeight: 1,
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
    const { moscowTimeInMinutes } = getMoscowTime();
    this.setState((prevState) => (prevState.moscowTime === moscowTimeInMinutes ? null : {
      moscowTime: moscowTimeInMinutes,
      // moscowTime: (((msk.minute() * 60) + msk.seconds()) * 10) % fullDay,
    }));
  }

  onChange(event: ChangeEvent<HTMLInputElement>) {
    let { value } = event.currentTarget;
    const { propName } = event.currentTarget.dataset;
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
      return;
    }
    switch (propName) {
    case 'neutralManaLevel':
    case 'visibleMoonManaTideHeight':
    case 'invisibleMoonManaTideHeight':
      if (numberValue <= 0) {
        return;
      }
      break;
    case 'visibleMoonPeriod':
    case 'invisibleMoonPeriod':
      if (numberValue <= 0) {
        return;
      }
      break;
    case 'visibleMoonNewMoonTime':
    case 'invisibleMoonNewMoonTime':
      break;
    default:
      throw new Error(`Unexpected propName: ${propName}`);
    }

    const { manaOcean, gameModel } = this.props;
    gameModel.execute({
      type: 'postSettings',
      name: 'manaOcean',
      settings: {
        ...manaOcean,
        [propName]: numberValue,
      },
    });
    // const { manaOceanSettings, gameModel } = this.props;
    // gameModel.execute({
    //   type: 'postManaOceanSettings',
    //   manaOceanSettings: {
    //     ...manaOceanSettings,
    //     [propName]: value,
    //   },
    // });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      moscowTime,
    } = this.state;
    // const { t, manaOceanSettings } = this.props;
    // if (manaOceanSettings === undefined || manaOceanSettings.visibleMoonPeriod === undefined) {
    const { t, manaOcean } = this.props;
    if (manaOcean === undefined || manaOcean.visibleMoonPeriod === undefined) {
      return null;
    }
    const {
      neutralManaLevel,
      visibleMoonPeriod,
      visibleMoonNewMoonTime,
      visibleMoonManaTideHeight,
      invisibleMoonPeriod,
      invisibleMoonNewMoonTime,
      invisibleMoonManaTideHeight,
    } = manaOcean;

    const visibleMoonActivity: TidePeriodProps[] = getMoonActivity({
      period: visibleMoonPeriod, 
      offset: visibleMoonNewMoonTime
    });
    const invisibleMoonActivity: TidePeriodProps[] = getMoonActivity({
      period: invisibleMoonPeriod, 
      offset: invisibleMoonNewMoonTime
    });
    const mergedActivities: TidePeriodProps[] = mergeActivities(visibleMoonActivity, invisibleMoonActivity);
    const seriesList: Series[] = [{
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
      <div className="ManaOceanSettings tw-h-full tw-overflow-auto">
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
                      data-prop-name="visibleMoonPeriod"
                      onChange={this.onChange}
                    />
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={visibleMoonNewMoonTime}
                      className="tw-w-24 tw-text-right"
                      data-prop-name="visibleMoonNewMoonTime"
                      onChange={this.onChange}
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
                      data-prop-name="invisibleMoonPeriod"
                      onChange={this.onChange}
                    />
                  </td>
                  <td align="right">
                    <Form.Control
                      type="number"
                      step={TIME_STEP}
                      value={invisibleMoonNewMoonTime}
                      className="tw-w-24 tw-text-right"
                      data-prop-name="invisibleMoonNewMoonTime"
                      onChange={this.onChange}
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
          {seriesList.map((series) => (
            <TideChart
              series={series}
              className="tw-mb-8"
              moscowTime={moscowTime}
            />
          ))}
        </div>
      </div>
    );
  }
}
