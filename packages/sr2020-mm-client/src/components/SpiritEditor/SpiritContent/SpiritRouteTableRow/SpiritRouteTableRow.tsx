import React, { useState, MouseEvent, ChangeEvent } from 'react';
import './SpiritRouteTableRow.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { 
  SpiritTimetable,
  SpiritRoute,
  TimetableItem,
  speedPercentValues
} from "sr2020-mm-event-engine";
import { WithTranslation } from "react-i18next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import TimePicker, { TimePickerValue } from "react-time-picker";

interface SpiritRouteTableRowProps extends WithTranslation {
  timetableItem: TimetableItem;
  route: SpiritRoute | undefined;
  index: number;
  updateRoute: (routeIndex: number, timetableItem: TimetableItem) => void;
  removeRoute: (routeIndex: number) => void;
}

function timeNumberToStr(timeNum: number): string {
  const hour = Math.floor(timeNum/60);
  const minute = timeNum%60;

  return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
}

function timeStrToNumber(timeStr: string): number {
  const [ hour, minute ] = timeStr.split(':');
  return Number(hour) * 60 + Number(minute);
}

export function SpiritRouteTableRow(props: SpiritRouteTableRowProps) {
  const { t, timetableItem, route, index, removeRoute, updateRoute } = props;

  const onSpeedPercentChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;
    updateRoute(index, {...timetableItem, speedPercent: Number(value)});
  }

  const onRemoveClick = (event: MouseEvent<HTMLElement>) => {
    removeRoute(index);
  }

  const onTimeChange = (value: TimePickerValue) => {
    if (value instanceof Date) {
      console.log('date value', value);
    } else {
      updateRoute(index, {...timetableItem, time: timeStrToNumber(value)});
    }
  };

  return (
    <div className="SpiritRouteTableRow tw-table-row">
      <div className="tw-table-cell tw-px-2 tw-text-right">
        <TimePicker
          clearIcon={null}
          disableClock
          onChange={onTimeChange}
          value={timeNumberToStr(timetableItem.time)}
        />
      </div>
      <div className="tw-table-cell tw-px-2 tw-text-left">{route?.name || t('notAvailable')}</div>
      <div className="tw-table-cell tw-px-2 tw-text-right">
        <Form.Control 
          as="select" 
          value={timetableItem.speedPercent}
          onChange={onSpeedPercentChange}
        >
          {
            speedPercentValues.map((value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            ))
          }
        </Form.Control>
      </div>
      <div className="tw-table-cell tw-px-2 tw-text-right">
        { 
          route !== undefined
          ? (route.waypoints.length * route.waitTimeMinutes / (timetableItem.speedPercent / 100)).toFixed(1)
          : t('notAvailable')
        }
      </div>
      <div>
        <Button variant="outline-secondary" title={t('delete')} onClick={onRemoveClick}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
    </div>
  );
}



