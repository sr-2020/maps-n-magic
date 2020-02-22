import React, { Component } from 'react';
import './ScatterRow.css';

import * as R from 'ramda';

import * as moment from 'moment';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, ScatterChart, Scatter,
} from 'recharts';

import { Scatters } from '../Scatters';

import { cleanRawData } from '../../../dataUtils/prepareScatterData';

// const beaconTable = require('../../../  ../../../data/postgresBeaconTable');
// import * as BeaconUtils from '../../../dataAnalysis/beaconUtils';

// console.log(BeaconUtils);
// import { ScatterRowPropTypes } from '../../types';

const CustomTooltip = ({
  active, payload, label, beaconIndex,
}) => {
  if (active) {
    const { beacon } = payload[1].payload;
    const date = new Date(payload[0].value);
    const { label } = beacon ? beaconIndex[beacon.beaconId] : '';
    const { beacons = [] } = payload[0].payload;

    return (
      <div className="custom-tooltip bg-gray-200">
        <p className="label">{`Время : ${moment(date).format('D MMM YYYY HH:mm:ss')}`}</p>
        <p className="intro">{`Маяк : ${beacon ? beacon.beaconId : ''} ${label}`}</p>
        <p className="intro">{`Уровень сигнала : ${payload[1].payload.level}`}</p>
        <p className="intro">{`Количество маяков в сообщении : ${beacons.length}`}</p>
      </div>
    );
  }

  return null;
};

export class ScatterRow extends Component {
  // static propTypes = ScatterRowPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      trackData, beaconLatlngsIndex, filterChart,
      filterSize, percentUsage, showExtendedChart,
      beaconIndex,
    } = this.props;

    const style = showExtendedChart ? {
      // width: 8000,
      width: 16000,
      // width: '100%',
      // height: 600,
      height: 400,
    } : {
      // width: 8000,
      width: '100%',
      height: 400,
    };

    return (
      <tr className="ScatterRow">
        <td
          colSpan="12"
          style={{
            maxWidth: '90vw',
            overflow: 'auto',
          }}
        >
          <div
            className="chart-container"
            style={style}
          >
            <ResponsiveContainer>
              <ScatterChart
                // width={"100%"}
                // height={"100%"}
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
                />
                <YAxis
                  type="number"
                  dataKey="level"
                  name="Уровень сигнала"
                  domain={[-120, 'auto']}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<CustomTooltip beaconIndex={beaconIndex} />}
                />
                <Legend />
                {Scatters(cleanRawData({
                  trackData,
                  rawDataArr: trackData.rawDataArr,
                  beaconLatlngsIndex,
                  filterChart,
                  filterSize,
                  percentUsage,
                }))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </td>
      </tr>
    );
  }
}
