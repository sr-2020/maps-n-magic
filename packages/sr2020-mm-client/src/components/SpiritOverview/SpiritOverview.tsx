import React, { useState, useEffect } from 'react';
import './SpiritOverview.css';
import * as R from 'ramda';
import classNames from 'classnames';

import { WithTranslation } from "react-i18next";
import { GameModel, getMoscowTime, getTimeOnRoute, Spirit, SpiritRoute, SpiritTimetable } from 'sr2020-mm-event-engine';

import { WithSpirits, WithSpiritFractions, WithSpiritRoutes } from '../../dataHOCs';
import { EntitiyListItem } from '../EntityList';

import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { formatMinutes } from '../ManaOceanSettings/TideChart/TideChart';
import { spiritStateSuffix } from '../SpiritEditor/SpiritList/SpiritList';
import { processForDisplay } from '../../i18n';

interface SpiritOverviewProps extends 
  WithTranslation, 
  WithSpirits, 
  WithSpiritFractions, 
  WithSpiritRoutes 
{
  gameModel: GameModel;
}

export function SpiritOverview(props: SpiritOverviewProps) {
  const [moscowMinutes, setMoscowMinutes] = useState<number>(0);

  useEffect(() => {
    const moscowTimeUpdater = setInterval(() => {
      const { moscowTimeInMinutes } = getMoscowTime();
      // const moscowTimeInMinutes = Date.now()/1000 % 1440;
      if (moscowMinutes !== moscowTimeInMinutes) {
        setMoscowMinutes(moscowTimeInMinutes);
      }
    }, 1000);
    return () => {
      clearInterval(moscowTimeUpdater);
    };
  }, []);

  const { spirits, spiritFractions, spiritRoutes, t } = props;

  if (spirits === null || spiritFractions === null || spiritRoutes === null) {
    return (
      <div>
        {t('spiritOverviewDataLoading')}
      </div>
    );
  }

  function spiritsToListItems(): EntitiyListItem[] {
    const { spirits, spiritFractions, t } = props;
    if (spirits === null || spiritFractions === null) {
      return [];
    }
    const fractionIndex = R.indexBy(R.prop('id'), spiritFractions);
    const items: EntitiyListItem[] = spirits.map(spirit => ({
      id: spirit.id,
      title: spirit.name + ", id " + spirit.id,
      subtitle: (fractionIndex[spirit.fraction]?.name || '') + '. ' +
        t(spirit.state.status) + spiritStateSuffix(spirit.state)
    }));
    return items;
  }

  const items = spiritsToListItems();

  const spiritIndex = spirits.reduce((acc, el) => {
    acc.set(el.id, el);
    return acc;
  }, new Map<number, Spirit>());

  const spiritRouteIndex = spiritRoutes.reduce((acc, el) => {
    acc.set(el.id, el);
    return acc;
  }, new Map<number, SpiritRoute>());

  const timeLine = moscowMinutes/14.40;

  return (
    <div className="SpiritOverview tw-p-8 tw-h-full tw-flex tw-flex-col tw-overflow-auto">
      {/* SpiritOverview content */}
      {
        items.map(item => 
          <div className="SpiritOverviewRow tw-flex tw-border-solid tw-border-b-2 tw-border-blue-700">

            <div className="body tw-bg-re_d-200 tw-w-64 tw-mb-4">
              <div className="spirit-name tw-font-bold tw-text-sm">
                {processForDisplay(item.title)}
              </div>
              <div className="spirit-fraction tw-text-sm">
                {processForDisplay(item.subtitle)}
              </div>
            </div>

            <div 
              className="tw-bg-gr___een-200 tw-flex-1  tw-py-4"
              style={{
                // background: "repeating-linear-gradient(90deg, #ff000022 0, #ff000022 3px, white 3px, white 4.166666666%, #0000ff22 0, #0000ff22 3px, white 3px, white 4.166666666%, #0000ff22 0, #0000ff22 3px, white 3px, white 4.166666666%)"
                // background: `repeating-linear-gradient(90deg, 
                //   #ff000022 0, #ff000022 0.2%, white 0.2%, white 4.166666666%, 
                //   #0000ff22 4.166666666%, #0000ff22 4.366666666%, white 4.366666666%, white 8.333333333%, 
                //   #0000ff22 8.333333333%, #0000ff22 8.533333333%, white 8.533333333%, white 12.5%
                //   )`
                // background: `
                //   repeating-linear-gradient(90deg, transparent 0, transparent 8.333333333%, #cccccc88 8.333333333%, #cccccc88 33%, transparent 33%, transparent 100%)
                //   `
                background: `
                repeating-linear-gradient(90deg, #0000ff22 0, #0000ff22 0.2%, transparent 0.2%, transparent 4.166666666%),
                repeating-linear-gradient(90deg, #0000ff44 0, #0000ff44 0.2%, transparent 0.2%, transparent 12.5%),
                repeating-linear-gradient(90deg, transparent 0, transparent 8.333333333%, #cccccc88 8.333333333%, #cccccc88 33.3333333333%, transparent 33.3333333333%, transparent 100%),
                linear-gradient(90deg, transparent 0, transparent ${timeLine}%, #ff0000dd ${timeLine}%, #ff0000dd ${timeLine + 0.2}%, transparent ${timeLine + 0.2}%, transparent 100%)
                  `
                // background: "repeating-linear-gradient(90deg, blue 0%, blue 0.5%, white 0.5%, white 4.166666666%)"
              }}
            >
              {
                <SpiritTimetableComponent 
                  spirit={spiritIndex.get(item.id)}
                  spiritRouteIndex={spiritRouteIndex}
                  timetable={spiritIndex.get(item.id)?.timetable}
                  moscowMinutes={moscowMinutes}
                  t={t}
                />
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

interface SpiritTimetableProps {
  // gameModel: GameModel;
  spirit: Spirit | undefined;
  timetable: SpiritTimetable | undefined;
  spiritRouteIndex: Map<number, SpiritRoute>;
  moscowMinutes: number;
  t: WithTranslation["t"];
}

export function SpiritTimetableComponent(props: SpiritTimetableProps) {
  const { 
    spirit, 
    timetable, 
    spiritRouteIndex, 
    moscowMinutes,
    t
  } = props;

  if (spirit === undefined || timetable === undefined) {
    return null;
  }
  
  return (
    <div>
      {
        timetable.map(item => {
          const route = spiritRouteIndex.get(item.routeId);
          if (route === undefined) {
            return null;
          }
          const startMinutes = item.time;
          const { timeOnRoute } = getTimeOnRoute(route, item.speedPercent);
          const endMinutes = Math.min(startMinutes + timeOnRoute, 1440);
          
          return (
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) => (
                <Tooltip id={"" + spirit.id + item.time + route.id} {...props}>
                  {t('startRouteAt', {minutes: formatMinutes(startMinutes)})}
                  <br/>
                  {t('timeOnRoute', { timeOnRoute })}
                </Tooltip>
              )}
            >
              <div 
                className={classNames('tw-relative tw-py-1 tw-px-2  tw-overflow-hidden ', {
                  'tw-bg-green-800 tw-text-white': spirit.state.status === 'OnRoute' && moscowMinutes > startMinutes && moscowMinutes < startMinutes + timeOnRoute,
                  'tw-bg-gray-300 tw-text-black tw-outline-gray-600 tw-outline-2 tw-outline-solid': true,
                })}
                style={{
                  left: `${startMinutes/14.40}%`,
                  width: `${timeOnRoute/14.40}%`,
                }}
              >
                {processForDisplay(route.name)}
              </div>
            </OverlayTrigger>
          );
        })
      }
    </div>
  );
}
