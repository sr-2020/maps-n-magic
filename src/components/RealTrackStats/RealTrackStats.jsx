import React, { Component } from 'react';
import './RealTrackStats.css';
import * as R from 'ramda';

import * as moment from 'moment';


import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, ScatterChart, Scatter,
} from 'recharts';

import Table from 'react-bootstrap/Table';
import { COLOR_PALETTE } from '../../utils/colorPalette';

import tracksData from '../../dataAnalysis/data/pt6.json';
import beaconLatlngs from '../../dataAnalysis/data/googleMapBeaconList.json';

const beaconLatlngsIndex = R.indexBy(R.prop('id'), beaconLatlngs);

// import { RealTrackStatsPropTypes } from '../../types';

// const data = [
//   { x: 100, y: 200, z: 200 },
//   { x: 120, y: 100, z: 260 },
//   { x: 170, y: 300, z: 400 },
//   { x: 140, y: 250, z: 280 },
//   { x: 150, y: 400, z: 500 },
//   { x: 110, y: 280, z: 200 },
// ];

const strFormat = R.curry((str, vals) => str.replace(/\{\{|\}\}|\{(\d+)\}/g, (m, n) => {
  if (m === '{{') { return '{'; }
  if (m === '}}') { return '}'; }
  return vals[n];
}));

const getCompletenessColor = (value, total) => {
  if (total === 0) { return 'transparent'; }
  function calc(b, a, part) {
    return ((a * part) + ((1 - part) * b)).toFixed(0);
  }

  let p = value / total;
  if (p < 0.5) {
    p *= 2;
    return strFormat('rgba({0},{1},{2}, 1)', [calc(251, 255, p), calc(126, 255, p), calc(129, 0, p)]); // red to yellow mapping
  }
  p = (p - 0.5) * 2;
  return strFormat('rgba({0},{1},{2}, 1)', [calc(255, 123, p), calc(255, 225, p), calc(0, 65, p)]); // yellow to green mapping
};

export class RealTrackStats extends Component {
  // static propTypes = RealTrackStatsPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('RealTrackStats mounted');
  }

  componentDidUpdate() {
    console.log('RealTrackStats did update');
  }

  componentWillUnmount() {
    console.log('RealTrackStats will unmount');
  }

  // eslint-disable-next-line max-lines-per-function
  getScatters(trackData) {
    const { res, beaconIds } = this.cleanRawData(trackData.rawDataArr);
    const { emptyMessages = [], indoors = [], outdoors = [] } = res;

    const findIndex = R.pipe(R.path(['loudestBeacon', 'beaconId']), R.toString, R.equals, R.findIndex(R.__, beaconIds));

    const getFillColor = (el) => {
      const index = findIndex(el);
      console.log('');
      // const color = COLOR_PALETTE[index % COLOR_PALETTE.length].color.background;
      const color = COLOR_PALETTE[index % COLOR_PALETTE.length].color.border;
      // const color = COLOR_PALETTE[index % 10].color.background;
      return color;
    };

    // console.log(findIndex({ beaconId: '5' }));

    return (
      [
        <Scatter name="Маяк в здании" data={indoors} fill="blue" shape="triangle">
          {
            indoors.map((entry, index) => (
              <Cell
                key={`indoors-cell-${index}`}
                stroke={getFillColor(entry)}
                fill="blue"
                strokeWidth="2"
                // stroke="blue"
                // fill={getFillColor(entry)}
                // strokeWidth="1"
                points=""
                // width="6"
                // height="6"
              />
            ))
          }
        </Scatter>,
        <Scatter name="Маяк на улице" data={outdoors} fill="red" shape="square">
          {
            outdoors.map((entry, index) => (
              <Cell
                key={`outdoors-cell-${index}`}
                stroke={getFillColor(entry)}
                fill="red"
                strokeWidth="2"
                // stroke="red"
                // fill={getFillColor(entry)}
                // strokeWidth="1"
                points=""
                // width="6"
              />
            ))
          }
        </Scatter>,
        <Scatter name="Маяка нет в сообщении" data={emptyMessages} fill="#82ca9d" shape="circle">
          {
            emptyMessages.map((entry, index) => (
              <Cell
                key={`empty-cell-${index}`}
                points=""
              />
            ))
          }
        </Scatter>,
      ]
    );
  }

  // eslint-disable-next-line class-methods-use-this
  cleanRawData(rawDataArr) {
    // const res = rawDataArr.slice(0, 1000).map((el) => ({
    const res = rawDataArr.map((el) => ({
    // const res = rawDataArr.filter(R.pipe(R.prop('loudestBeacon'), R.isNil, R.not)).map((el) => ({
      ...el,
      level: el.loudestBeacon ? el.loudestBeacon.level : -120,
      // eslint-disable-next-line no-nested-ternary
      placement: el.loudestBeacon
        ? (beaconLatlngsIndex[el.loudestBeacon.beaconId] ? 'outdoors' : 'indoors')
        : null,
    }));
    const res2 = R.groupBy((el) => (!el.loudestBeacon ? 'emptyMessages' : el.placement), res);
    const filter = R.pipe(R.prop('loudestBeacon'), R.isNil, R.not);
    const makeIndex = R.indexBy(R.path(['loudestBeacon', 'beaconId']));
    const getBeaconIds = R.pipe(R.filter(filter), makeIndex, R.keys);

    const beaconIds = getBeaconIds(rawDataArr);

    return {
      res: res2,
      beaconIds,
    };
    // return rawDataArr;
  }


  // eslint-disable-next-line max-lines-per-function
  render() {
    // const { something } = this.state;
    // // const { t } = this.props;

    // if (!something) {
    //   return <div> RealTrackStats stub </div>;
    //   // return null;
    // }

    const formatPercent = (num) => ((num) * 100).toFixed(1);

    const histToData = (val) => R.toPairs(val).map(([name, value]) => ({ name, value }));

    const sortByTotal = R.sortBy((el) => -el.stats.total);
    return (
      <div className="RealTrackStats mx-auto p-4">
        <Table
          bordered
          hover
          size="sm"
          // className="m-4"
          // style={{
          //   boxSizing: 'border-box',
          // }}
        >
          <thead>
            <tr>
              <th>Имя пользователя</th>
              <th colSpan="2" className="text-right">Число пустых сообщений</th>
              <th colSpan="2" className="text-right">Число не пустых сообщений</th>
              <th className="text-right">Всего сообщений</th>
              <th colSpan="2" className="text-right">Число сообщений с известными координатами</th>
              <th colSpan="2" className="text-right">Число сообщений с неизвестными координатами (здания?)</th>
              <th className="text-right">Средний интервал между сообщениями, с</th>
              <th className="text-right">Гистограмма интервалов между сообщениями</th>
            </tr>
            <tr>
              <th />
              <th className="text-right">шт</th>
              <th className="text-right">Процент</th>
              <th className="text-right">шт</th>
              <th className="text-right">Процент</th>
              <th className="text-right">шт</th>
              <th className="text-right">шт</th>
              <th className="text-right">Процент</th>
              <th className="text-right">шт</th>
              <th className="text-right">Процент</th>
            </tr>
          </thead>
          <tbody>
            {
              // eslint-disable-next-line max-lines-per-function
              sortByTotal(Object.values(tracksData)).map((trackData, index) => (
                <>
                  <tr>
                    <td>{trackData.userData.name}</td>
                    <td className="text-right">{trackData.stats.emptyMessages}</td>
                    <td
                      className="text-right"
                      style={
                        {
                          backgroundColor: getCompletenessColor(1 - trackData.stats.emptyMessagesFraction, 1),
                        }
                      }
                    >
                      {formatPercent(trackData.stats.emptyMessagesFraction)}
                    </td>
                    <td className="text-right">{trackData.stats.unknownBeaconLatlngs + trackData.stats.knownBeaconLatlngs}</td>
                    <td
                      className="text-right"
                      style={
                        {
                          backgroundColor: getCompletenessColor(trackData.stats.unknownBeaconLatlngsFraction
                          + trackData.stats.knownBeaconLatlngsFraction, 1),
                        }
                      }
                    >
                      {formatPercent(trackData.stats.unknownBeaconLatlngsFraction
                        + trackData.stats.knownBeaconLatlngsFraction)}
                    </td>
                    <td className="text-right">{trackData.stats.total}</td>

                    <td className="text-right">{trackData.stats.knownBeaconLatlngs}</td>
                    <td className="text-right">
                      {formatPercent(trackData.stats.knownBeaconLatlngsFraction)}
                    </td>

                    <td className="text-right">{trackData.stats.unknownBeaconLatlngs}</td>
                    <td className="text-right">
                      {formatPercent(trackData.stats.unknownBeaconLatlngsFraction)}
                    </td>
                    <td className="text-right">{(trackData.stats.avgMessageInterval / 1000).toFixed(2)}</td>
                    <td>

                      {/* <ResponsiveContainer> */}
                      <BarChart width={300} height={50} data={histToData(trackData.stats.messageIntervalHist)}>
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
                        {/* {!hideXAxis ? <XAxis dataKey="label" /> : ''} */}
                        {/* <YAxis width={30} interval="preserveStartEnd" /> */}
                        {/* <Tooltip content={<CustomHistTooltip tooltipKey={tooltipKey} t={t} />} /> */}
                        <Tooltip />
                        <Bar dataKey="value" fill="#7be141" />
                      </BarChart>
                      {/* </ResponsiveContainer> */}
                    </td>
                  </tr>
                  {
                    ((index === 6) || false) && (
                      <tr>
                        <td colSpan="12" style={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer>
                            <ScatterChart
                              margin={{
                                top: 20, right: 20, bottom: 20, left: 20,
                              }}
                            >
                              <CartesianGrid />
                              <XAxis
                                type="number"
                                dataKey="timeMillis"
                                domain={[trackData.stats.minTimeMillis - 600000, trackData.stats.maxTimeMillis + 600000]}
                                tickFormatter={(unixTime) => moment(unixTime).format('HH:mm Do')}
                                name="Время"
                                // unit="cm"
                              />
                              <YAxis
                                type="number"
                                dataKey="level"
                                name="Уровень сигнала"
                                // unit="kg"
                                domain={[-120, 'auto']}
                              />
                              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                              <Legend />
                              {/* <Scatter name="A school" data={data} fill="#8884d8" /> */}
                              {this.getScatters(trackData)}
                              {/* <Scatter name="A school" data={this.cleanRawData(trackData.rawDataArr)} fill="#8884d8">
                                {
                                  data.map((entry, index) => <Cell key={`cell-${index}`} fill="#8884d8" shape="triangle" />)
                                }
                              </Scatter> */}
                            </ScatterChart>
                          </ResponsiveContainer>
                        </td>
                      </tr>
                    )
                  }
                </>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
