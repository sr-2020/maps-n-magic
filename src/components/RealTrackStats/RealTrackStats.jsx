import React, { Component } from 'react';
import './RealTrackStats.css';
import * as R from 'ramda';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie,
} from 'recharts';

import Table from 'react-bootstrap/Table';

import tracksData from '../../dataAnalysis/data/pt6.json';

// import { RealTrackStatsPropTypes } from '../../types';

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
              sortByTotal(Object.values(tracksData)).map((trackData) => (
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
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
