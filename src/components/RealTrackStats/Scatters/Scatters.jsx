import React from 'react';
import './Scatters.css';

import * as R from 'ramda';

import * as moment from 'moment';

import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, ScatterChart, Scatter,
} from 'recharts';
import { COLOR_PALETTE } from '../../../utils/colorPalette';

// import { ScattersPropTypes } from '../../types';


const getFillColor = (index) => {
  // const index = findIndex(el);
  // console.log('');
  // const color = COLOR_PALETTE[index % COLOR_PALETTE.length].color.background;
  const color = COLOR_PALETTE[index % COLOR_PALETTE.length].color.border;
  // const color = COLOR_PALETTE[index % 10].color.background;
  return color;
};
// eslint-disable-next-line max-lines-per-function
export function Scatters(props) {
  const { res, beaconIds, gpsTrack } = props;
  // const findIndex = R.pipe(R.path(['loudestBeacon', 'beaconId']), R.toString, R.equals, R.findIndex(R.__, beaconIds));
  const findIndex = R.pipe(R.path(['beacon', 'beaconId']), R.toString, R.equals, R.findIndex(R.__, beaconIds.map(String)));

  const { emptyMessages = [], indoors = [], outdoors = [] } = res;

  const arr = [
    <Scatter name="Маяк в здании" data={indoors} fill="blue" shape="triangle">
      {
        indoors.map((entry, index) => (
          <Cell
            // key={`indoors-cell-${index}`}
            key={`indoors-cell-${entry.timeMillis}`}
            stroke={getFillColor(findIndex(entry))}
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
            // key={`outdoors-cell-${index}`}
            key={`outdoors-cell-${entry.timeMillis}`}
            stroke={getFillColor(findIndex(entry))}
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
            // key={`empty-cell-${index}`}
            key={`empty-cell-${entry.timeMillis}`}
            points=""
          />
        ))
      }
    </Scatter>,
  ];

  if (gpsTrack && gpsTrack.length > 0) {
    gpsTrack.map((el) => (el.level = -110));
    arr.push(
      <Scatter name="GPS сигнал" data={gpsTrack} fill="green" shape="star">
        {
          gpsTrack.map((entry, index) => (
            <Cell
            // key={`empty-cell-${index}`}
              key={`gps-cell-${entry.timeMillis}`}
              points=""
            />
          ))
        }
      </Scatter>,
    );
  }

  // console.log(findIndex({ beaconId: '5' }));
  return arr;
}

// Scatters.propTypes = ScattersPropTypes;
