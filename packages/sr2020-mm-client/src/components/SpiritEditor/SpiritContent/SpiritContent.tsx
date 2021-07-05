import React, { Component, ChangeEvent, useState } from 'react';
import './SpiritContent.css';
import * as R from 'ramda';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DocumentTitle from 'react-document-title';
import { WithTranslation } from "react-i18next";
import { 
  GameModel, 
  Spirit, 
  GetSpirit, 
  EPutSpiritRequested,
  SpiritTimetable,
  TimetableItem,
  SpiritStatus,
  SpiritStatusList
} from "sr2020-mm-event-engine";

import { SpiritFractionInput } from "./SpiritFractionInput";
import { RouteInput } from "./RouteInput";
import { SpiritRouteTable } from "./SpiritRouteTable";
import { SpiritStatusControl } from "./SpiritStatusControl";

import { WithSpiritRoutes } from '../../../dataHOCs';
import { SpiritNumberSelect } from './SpiritNumberSelect';

// import { AbilitiesInput } from './AbilitiesInput';

interface SpiritContentProps extends WithTranslation, WithSpiritRoutes {
  id: number;
  gameModel: GameModel;
}
type SpiritContentState = {
  initialized: false;
} | {
  initialized: true;
  name: Spirit["name"];
  fraction: Spirit["fraction"];
  story: Spirit["story"];
  level: Spirit["level"];
  hitPoints: Spirit["hitPoints"];
  // maxHitPoints: Spirit["maxHitPoints"];
  timetable: Spirit["timetable"];
  state: Spirit["state"];
};

type spiritFields = 
  | 'name' 
  | 'fraction' 
  | 'story' 
  | 'maxHitPoints'
  | 'timetable'
  | 'state'
  | 'level'
  | 'hitPoints'
;

const sortByTime = R.sortBy(R.prop('time'));

const LEVEL_LIST = [1, 2, 3];
const HIT_POINTS_LIST = [1, 2, 3, 4, 5, 6];

export class SpiritContent extends Component<
  SpiritContentProps, 
  SpiritContentState
> {
  updateSpiritTimeoutId: NodeJS.Timeout | undefined;

  constructor(props: SpiritContentProps) {
    super(props);
    const { gameModel, id } = props;
    
    const spirit = gameModel.get2<GetSpirit>({
      type: 'spirit',
      id,
    });
    
    if (spirit) {
      this.state = {
        initialized: true,
        name: spirit.name,
        fraction: spirit.fraction,
        story: spirit.story,
        // maxHitPoints: spirit.maxHitPoints,
        timetable: spirit.timetable,
        level: spirit.level,
        hitPoints: spirit.hitPoints,
        state: spirit.state,
      };
    } else {
      this.state = {
        initialized: false,
      };
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addRoute = this.addRoute.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
    this.removeRoute = this.removeRoute.bind(this);
    this.sortRoutes = this.sortRoutes.bind(this);
    this.changeSpiritStatus = this.changeSpiritStatus.bind(this);
    this.updateSpirit = this.updateSpirit.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetValue(name: spiritFields, target: HTMLInputElement) {
    switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'number':
      return Number(target.value);
    default:
      if ( name === 'fraction' 
        || name === 'level' 
        || name === 'hitPoints'
      ) {
        return Number(target.value);
      }
      return target.value;
    }
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const name = target.name as spiritFields;
    const value = this.getTargetValue(name, target);
    this.setState(prevState => ({...prevState, [name]: value}), this.updateSpirit);
  }

  addRoute (routeId: number): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      const { timetable } = prevState;
      // const changedTimetable = sortByTime([...timetable, {
      const changedTimetable = ([...timetable, {
        routeId,
        time: 0,
        speedPercent: 100
      }]);
      return {...prevState, timetable: changedTimetable};
    }, this.updateSpirit);
  }

  updateRoute (routeIndex: number, timetableItem: TimetableItem): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      const { timetable } = prevState;
      const changedTimetable1 = [...timetable];
      changedTimetable1[routeIndex] = timetableItem;
      // const changedTimetable = sortByTime(changedTimetable1);
      const changedTimetable = (changedTimetable1);
      return {...prevState, timetable: changedTimetable};
    }, this.updateSpirit);
  }

  removeRoute (routeIndex: number): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      const { timetable } = prevState;
      const changedTimetable = R.remove(routeIndex, 1, timetable);
      return {...prevState, timetable: changedTimetable};
    }, this.updateSpirit);
  }

  sortRoutes (): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      const { timetable } = prevState;
      const changedTimetable = sortByTime(timetable);
      return {...prevState, timetable: changedTimetable};
    }, this.updateSpirit);
  }

  changeSpiritStatus (status: "NotInGame" | "RestInAstral"): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }

      const state: Spirit["state"] = { status };
      
      return { ...prevState, state };
    }, this.updateSpirit);
  }

  updateSpirit(): void {
    const { id, gameModel } = this.props;
    const { state } = this;
    
    if (!state.initialized) {
      return;
    }
    if (this.updateSpiritTimeoutId !== undefined) {
      clearTimeout(this.updateSpiritTimeoutId);
    }

    this.updateSpiritTimeoutId = setTimeout(() => {
      gameModel.emit2<EPutSpiritRequested>({
        type: 'putSpiritRequested',
        id,
        props: {
          name: state.name,
          fraction: state.fraction,
          story: state.story,
          level: state.level,
          hitPoints: state.hitPoints,
          // maxHitPoints: state.maxHitPoints,
          timetable: state.timetable,
          state: state.state,
        }
      });
    }, 500);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const componentState = this.state;
    if (!componentState.initialized) {
      return null;
    }
    const {
      name, 
      fraction, 
      story, 
      initialized, 
      timetable, 
      state, 
      level, 
      hitPoints
    } = componentState;
    const { gameModel, id, t, spiritRoutes } = this.props;

    if (!id) {
      return (
        <div className="SpiritContent tw-flex-grow">
          {t('youHaveNoSpirits')}
        </div>
      );
    }

    if (spiritRoutes === null) {
      return (
        null
        // <div className="SpiritContent tw-flex-grow">
        //   {t('routesNotLoaded'}
        // </div>
      );
    }

    return (
      <DocumentTitle title={t('spiritPageTitle', {
        name,
        id,
        status: t(state.status)
      })}>

        <div className="SpiritContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div>
            <h2 className="tw-mb-8 tw-w-2/4">
              <Form.Control
                name="name"
                type="text"
                className="tw-text-3xl"
                value={name}
                onChange={this.handleInputChange}
              />
            </h2>

            <div className="tw-table">
              <div className="tw-table-column tw-w-1/6" />
              {/* <h3 className="table-caption">Spirit info</h3> */}
              {/* <div className="table-row">
                <div className="table-cell">Aura</div>
                <div className="table-cell">
                  {aura}
                </div>
              </div> */}
              <div className="tw-table-row">
                <label htmlFor="fractionInput" className="tw-table-cell">{t('status')}</label>
                <SpiritStatusControl
                  state={state}
                  changeSpiritStatus={this.changeSpiritStatus}
                />
              </div>
              <div className="tw-table-row">
                <label htmlFor="fractionInput" className="tw-table-cell">{t('fraction')}</label>
                <div className="tw-table-cell">
                  <SpiritFractionInput 
                    gameModel={gameModel}
                    id="fractionInput"
                    name="fraction"
                    value={fraction}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="levelInput" className="tw-table-cell">Уровень</label>
                <div className="tw-table-cell">
                  <SpiritNumberSelect 
                    id="levelInput"
                    name="level"
                    value={level}
                    domain={LEVEL_LIST}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="hitPointsInput" className="tw-table-cell">Хиты</label>
                <div className="tw-table-cell">
                  <SpiritNumberSelect 
                    id="hitPointsInput"
                    name="hitPoints"
                    value={hitPoints}
                    domain={HIT_POINTS_LIST}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="newRoute" className="tw-table-cell">{t('routes')}</label>
                <div className="tw-table-cell">
                  <RouteInput
                    id="newRoute" 
                    spiritRoutes={spiritRoutes}
                    addRoute={this.addRoute}
                  />

                  <SpiritRouteTable 
                    timetable={timetable}
                    spiritRoutes={spiritRoutes}
                    updateRoute={this.updateRoute}
                    removeRoute={this.removeRoute}
                  />

                  <Button variant="outline-secondary" onClick={this.sortRoutes}>
                    {t('sortRoutesByTime')}
                  </Button>
                </div>
              </div>
              {/* <div className="tw-table-row">
                <label htmlFor="maxHitPointsInput" className="tw-table-cell">{t('maxHitPoints')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="maxHitPoints"
                    type="number"
                    className="tw-w-1/4"
                    id="maxHitPointsInput"
                    value={maxHitPoints}
                    onChange={this.handleInputChange}
                    disabled
                    // list="fraction-datalist"
                  />
                </div>
              </div> */}
              {/* <div className="tw-table-row">
                <label htmlFor="storyInput" className="tw-table-cell">{t('story')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="story"
                    as="textarea"
                    id="storyInput"
                    rows={3}
                    value={story}
                    disabled
                    onChange={this.handleInputChange}
                  />
                </div>
              </div> */}
              {/* <div className="tw-table-row">
                <label htmlFor="newAbility" className="tw-table-cell">{t('abilities')}</label>
                <div className="tw-table-cell">
                  <AbilitiesInput
                    gameModel={gameModel}
                    id={id}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
