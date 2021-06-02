import React from 'react';
import './SpiritRouteTable.css';

import { WithTranslation } from "react-i18next";
import { 
  SpiritTimetable,
  SpiritRoute,
  TimetableItem
} from "sr2020-mm-event-engine";
import * as R from 'ramda';

import { SpiritRouteTableRow } from "../SpiritRouteTableRow";


interface SpiritRouteTableProps extends WithTranslation {
  timetable: SpiritTimetable;
  spiritRoutes: SpiritRoute[];
  updateRoute: (routeIndex: number, timetableItem: TimetableItem) => void;
  removeRoute: (routeIndex: number) => void;
}

export function SpiritRouteTable(props: SpiritRouteTableProps) {
  const { t, timetable, spiritRoutes, removeRoute, updateRoute } = props;

  const spiritRouteIndex = R.indexBy(R.prop('id'), spiritRoutes);

  return (
    <div className="SpiritRouteTable tw-table">
      <div className="tw-table-header-group">
        <div className="tw-table-row">
          <div className="tw-table-cell tw-px-2 tw-text-right">Время</div>
          <div className="tw-table-cell tw-px-2 tw-text-left">Маршрут</div>
          <div className="tw-table-cell tw-px-2 tw-text-right">Скорость, %</div>
          <div className="tw-table-cell tw-px-2 tw-text-right">Время в пути, мин</div>
        </div>
      </div>
      <div className="tw-table-row-group">
        {
          timetable.map((timetableItem, index) => (
            <SpiritRouteTableRow
              timetableItem={timetableItem}
              route={spiritRouteIndex[timetableItem.routeId]}
              index={index}
              updateRoute={updateRoute}
              removeRoute={removeRoute}
            />
          ))
        }
      </div>
    </div>
  );
}



