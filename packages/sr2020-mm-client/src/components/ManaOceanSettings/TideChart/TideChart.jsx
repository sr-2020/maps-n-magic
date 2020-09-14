import React from 'react';
import './TideChart.css';
import * as R from 'ramda';
// import { t } from 'react-i18next';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, AreaChart, Area, ResponsiveContainer, Label,
  ReferenceLine, ReferenceArea,
} from 'recharts';

import { fullDay } from 'sr2020-mm-event-engine/utils/moonActivityUtils';

const ticks = R.range(1, 24).map(R.multiply(60));

function CustomTooltip(props) {
  const {
    active, payload, label, t,
  } = props;

  if (active) {
    const rawEl = payload[0].payload;
    const formattedTime = formatMinutes(rawEl.startTime);
    return (
      <div className="custom-tooltip tw-bg-gray-100 tw-px-4 tw-py-2 tw-opacity-90">
        <p className="label">{`${t('time')} ${formattedTime}`}</p>
        <p className="label">{`${t('tideHeight')} ${rawEl.value}`}</p>
        <p className="label">{`${t('intervalDuration')} ${rawEl.intervalDuration} ${t('minute')}`}</p>
      </div>
    );
  }

  return null;
}

function formatMinutes(minutes) {
  const hour = Math.floor(minutes / 60);
  let minute = (minutes % 60);
  minute = (minute < 10 ? '0' : '') + minute;
  return `${hour}:${minute}`;
}

function CustomizedAxisTick(props) {
  const {
    x, y, stroke, payload,
  } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        // transform="rotate(-35)"
      >
        {payload.value / 60}

      </text>
    </g>
  );
}

// import { TideChartPropTypes } from '../../types';

// eslint-disable-next-line max-lines-per-function
export function TideChart(props) {
  const {
    yDomain, yTicks, data, chartName, seriesName, className, t, moscowTime,
  } = props;

  return (
    <div className={className}>
      <h2 className="tw-text-xl tw-m-4">{chartName}</h2>
      <div style={{ height: '20rem' }}>

        <ResponsiveContainer>
          <AreaChart margin={{
            top: 20, right: 20, bottom: 20, left: 20,
          }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="startTime"
              domain={[0, fullDay]}
              ticks={ticks}
              tick={<CustomizedAxisTick />}
            >
              <Label value={t('time_hour')} offset={0} position="bottom" />
            </XAxis>
            <YAxis
              dataKey="value"
              domain={yDomain}
              ticks={yTicks}
            >
              <Label value={t('tLabel_tideHeight')} offset={0} angle={-90} />
            </YAxis>
            <Tooltip content={<CustomTooltip t={t} />} />
            {/* <Legend /> */}
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={0.5} stopColor="green" stopOpacity={1} />
                <stop offset={0.5} stopColor="red" stopOpacity={1} />
                {/* <stop offset={off} stopColor="green" stopOpacity={1} />
                    <stop offset={off} stopColor="red" stopOpacity={1} /> */}
              </linearGradient>
            </defs>
            <Area
              type="stepAfter"
              // type="monotone"
              dataKey="value"
              data={data}
              name={seriesName}
              key={seriesName}
              stroke="#000"
              fill="url(#splitColor)"
            />
            <ReferenceLine x={moscowTime} stroke="red">
              <Label value={`${t('moscowTime')} ${formatMinutes(moscowTime)}`} position="top" />
            </ReferenceLine>

            <ReferenceArea
              x1={2 * 60}
              x2={8 * 60}
              y1={R.head(yTicks)}
              y2={R.last(yTicks)}
              // stroke="red"
              strokeOpacity={0.3}
            >
              <Label value={t('dailyBlackout')} position="bottomInside" />
            </ReferenceArea>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
}

// TideChart.propTypes = TideChartPropTypes;
