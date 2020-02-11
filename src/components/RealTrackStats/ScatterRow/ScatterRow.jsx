import React, { Component } from 'react';
import './ScatterRow.css';

import * as R from 'ramda';

import * as moment from 'moment';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, ScatterChart, Scatter,
} from 'recharts';

import { Scatters } from '../Scatters';

import { cleanRawData } from './prepareScatterData';

// import { ScatterRowPropTypes } from '../../types';

export class ScatterRow extends Component {
  // static propTypes = ScatterRowPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { trackData, beaconLatlngsIndex } = this.props;

    return (
      <tr className="ScatterRow">
        <td colSpan="12">
          <div
            className="chart-container"
            style={{
              width: 8000,
              // width: '100%',
              height: 600,
            }}
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
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                {Scatters(cleanRawData(trackData.rawDataArr, beaconLatlngsIndex))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </td>
      </tr>
    );
  }
}
