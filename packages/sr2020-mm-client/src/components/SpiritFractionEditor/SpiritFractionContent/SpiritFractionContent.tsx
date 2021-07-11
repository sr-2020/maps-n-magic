import React, { Component, ChangeEvent, useState } from 'react';
import './SpiritFractionContent.css';
import * as R from 'ramda';

import { WithTranslation } from "react-i18next";
import { EPutSpiritFractionRequested, GameModel, GetSpiritFraction, SpiritFraction } from 'sr2020-mm-event-engine';
import DocumentTitle from 'react-document-title';
import Form from 'react-bootstrap/Form';

interface SpiritFractionContentProps extends WithTranslation {
  id: number;
  gameModel: GameModel;
}
type SpiritFractionContentState = {
  initialized: false;
} | {
  initialized: true;
  name: SpiritFraction["name"];
  // abilities: Spirit["abilities"];
};

type spiritFields = 
  | 'name' 
  // | 'fraction' 
  // | 'story' 
  // | 'maxHitPoints'
  // | 'timetable'
  // | 'state'
  // | 'level'
  // | 'hitPoints'
  | 'abilities'
;

const sortByTime = R.sortBy(R.prop('time'));

const LEVEL_LIST = [1, 2, 3];
const HIT_POINTS_LIST = [1, 2, 3, 4, 5, 6];

export class SpiritFractionContent extends Component<
  SpiritFractionContentProps, 
  SpiritFractionContentState
> {
  updateSpiritTimeoutId: NodeJS.Timeout | undefined;

  constructor(props: SpiritFractionContentProps) {
    super(props);
    const { gameModel, id } = props;
    
    const spiritFraction = gameModel.get2<GetSpiritFraction>({
      type: 'spiritFraction',
      id,
    });
    
    if (spiritFraction) {
      this.state = {
        initialized: true,
        name: spiritFraction.name,
        // abilities: spirit.abilities,
      };
    } else {
      this.state = {
        initialized: false,
      };
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.addRoute = this.addRoute.bind(this);
    // this.updateRoute = this.updateRoute.bind(this);
    // this.removeRoute = this.removeRoute.bind(this);
    // this.sortRoutes = this.sortRoutes.bind(this);
    // this.changeSpiritStatus = this.changeSpiritStatus.bind(this);
    this.changeSpiritAbilities = this.changeSpiritAbilities.bind(this);
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
      // if ( name === 'fraction' 
      //   || name === 'level' 
      //   || name === 'hitPoints'
      // ) {
      //   return Number(target.value);
      // }
      return target.value;
    }
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const name = target.name as spiritFields;
    const value = this.getTargetValue(name, target);
    this.setState(prevState => ({...prevState, [name]: value}), this.updateSpirit);
  }

  // addRoute (routeId: number): void {
  //   this.setState((prevState) => {
  //     if (!prevState.initialized) {
  //       return;
  //     }
  //     const { timetable } = prevState;
  //     // const changedTimetable = sortByTime([...timetable, {
  //     const changedTimetable = ([...timetable, {
  //       routeId,
  //       time: 0,
  //       speedPercent: 100
  //     }]);
  //     return {...prevState, timetable: changedTimetable};
  //   }, this.updateSpirit);
  // }

  // updateRoute (routeIndex: number, timetableItem: TimetableItem): void {
  //   this.setState((prevState) => {
  //     if (!prevState.initialized) {
  //       return;
  //     }
  //     const { timetable } = prevState;
  //     const changedTimetable1 = [...timetable];
  //     changedTimetable1[routeIndex] = timetableItem;
  //     // const changedTimetable = sortByTime(changedTimetable1);
  //     const changedTimetable = (changedTimetable1);
  //     return {...prevState, timetable: changedTimetable};
  //   }, this.updateSpirit);
  // }

  // removeRoute (routeIndex: number): void {
  //   this.setState((prevState) => {
  //     if (!prevState.initialized) {
  //       return;
  //     }
  //     const { timetable } = prevState;
  //     const changedTimetable = R.remove(routeIndex, 1, timetable);
  //     return {...prevState, timetable: changedTimetable};
  //   }, this.updateSpirit);
  // }

  // sortRoutes (): void {
  //   this.setState((prevState) => {
  //     if (!prevState.initialized) {
  //       return;
  //     }
  //     const { timetable } = prevState;
  //     const changedTimetable = sortByTime(timetable);
  //     return {...prevState, timetable: changedTimetable};
  //   }, this.updateSpirit);
  // }

  // changeSpiritStatus (status: "NotInGame" | "RestInAstral"): void {
  //   this.setState((prevState) => {
  //     if (!prevState.initialized) {
  //       return;
  //     }

  //     const state: Spirit["state"] = { status };
      
  //     return { ...prevState, state };
  //   }, this.updateSpirit);
  // }

  changeSpiritAbilities (abilities: string[]): void {
    // this.setState((prevState) => {
    //   if (!prevState.initialized) {
    //     return;
    //   }
      
    //   return { ...prevState, abilities };
    // }, this.updateSpirit);
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
      gameModel.emit2<EPutSpiritFractionRequested>({
        type: 'putSpiritFractionRequested',
        id,
        props: {
          name: state.name,
          // fraction: state.fraction,
          // story: state.story,
          // level: state.level,
          // hitPoints: state.hitPoints,
          // // maxHitPoints: state.maxHitPoints,
          // timetable: state.timetable,
          // state: state.state,
          // abilities: state.abilities,
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
      // fraction, 
      // story, 
      initialized, 
      // timetable, 
      // state, 
      // level, 
      // hitPoints,
      // abilities,
    } = componentState;
    const { gameModel, id, t } = this.props;

    if (!id) {
      return (
        <div className="SpiritFractionContent tw-flex-grow">
          {t('youHaveNoSpirits')}
        </div>
      );
    }

    // if (spiritRoutes === null) {
    //   return (
    //     null
    //     // <div className="SpiritFractionContent tw-flex-grow">
    //     //   {t('routesNotLoaded'}
    //     // </div>
    //   );
    // }

    return (
      <DocumentTitle title={'Фракция духов ' + name}>

        <div className="SpiritFractionContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div>
            <h2 className="tw-mb-8 tw-w-2/4">
              <Form.Control
                name="name"
                type="text"
                className="tw-text-3xl"
                value={name}
                // onChange={this.handleInputChange}
                readOnly
              />
            </h2>

            <div className="tw-table">
              {/* <div className="tw-table-row">
                <label htmlFor="abilitiesInput" className="tw-table-cell">Абилки</label>
                <div className="tw-table-cell">
                  <AbilitiesInput2
                    id="abilitiesInput"
                    gameModel={gameModel}
                    abilities={abilities}
                    onChange={this.changeSpiritAbilities}
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


