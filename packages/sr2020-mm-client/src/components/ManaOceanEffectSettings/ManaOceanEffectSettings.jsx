import React, { Component } from 'react';
import './ManaOceanEffectSettings.css';
import * as R from 'ramda';

// import { ManaOceanSettingsPropTypes } from '../../types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { prop } from 'ramda';

import {
  getMoonActivity, mergeActivities, collectStatistics, getMoscowTime,
} from 'sr2020-mm-event-engine/utils/moonActivityUtils';
// import { TideChart } from './TideChart';

const TIME_STEP = 10;

function formatMinutesStats(minutes) {
  return (minutes / 60).toFixed(1);
}

export class ManaOceanEffectSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moscowTime: 0,
    };
    this.onChange = this.onChange.bind(this);
    this.onUpdateMoscowTime = this.onUpdateMoscowTime.bind(this);
  }

  componentDidMount() {
    this.moscowTimeUpdater = setInterval(this.onUpdateMoscowTime, 1000);
    // this.moscowTimeUpdater = setInterval(this.onUpdateMoscowTime, 100);
    console.log('ManaOceanSettings mounted');
  }

  componentDidUpdate(prevProps) {
    console.log('ManaOceanSettings did update');
  }

  componentWillUnmount() {
    clearInterval(this.moscowTimeUpdater);
    console.log('ManaOceanSettings will unmount');
  }

  onUpdateMoscowTime() {
    const { moscowTimeInMinutes } = getMoscowTime();
    this.setState((prevState) => (prevState.moscowTime === moscowTimeInMinutes ? null : {
      moscowTime: moscowTimeInMinutes,
      // moscowTime: (((msk.minute() * 60) + msk.seconds()) * 10) % fullDay,
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  onChange(event) {
    let { value } = event.target;
    const { propName, multiplier } = event.target.dataset;
    const multiplier2 = Number(multiplier || 1);
    value = (Number(value) * multiplier2);
    if (Number.isNaN(value)) {
      return;
    }

    switch (propName) {
    case 'massacreDelay':
    case 'powerSpellDelay':
    case 'ritualDelay':
      if (value < 0) {
        return;
      }
      break;
    case 'massacreDuration':
    case 'powerSpellDuration':
    case 'powerSpellBoundary':
    case 'ritualMembersBoundary':
    case 'spellDurationItem':
    case 'spellProbabilityPerPower':
    case 'spellDurationPerPower':
      if (value <= 0) {
        return;
      }
      break;
    default:
      throw new Error(`Unexpected propName: ${propName}`);
    }

    // console.log('propName', propName, value);

    const { manaOceanEffects, gameModel } = this.props;
    gameModel.execute({
      type: 'postSettings',
      name: 'manaOceanEffects',
      settings: {
        ...manaOceanEffects,
        [propName]: value,
      },
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      moscowTime,
    } = this.state;
    // const { t, manaOceanSettings } = this.props;
    // if (manaOceanSettings === undefined || manaOceanSettings.visibleMoonPeriod === undefined) {
    const { t, manaOceanEffects } = this.props;
    if (manaOceanEffects === undefined || manaOceanEffects.massacreDelay === undefined) {
      return null;
    }
    const {
      massacreDelay,
      massacreDuration,
      powerSpellBoundary,
      powerSpellDelay,
      powerSpellDuration,
      ritualMembersBoundary,
      ritualDelay,
      spellDurationItem,
      spellProbabilityPerPower,
      spellDurationPerPower,
    } = manaOceanEffects;

    return (
      <div className="ManaOceanEffectSettings">
        <div className="tw-flex">
          <div className="tw-m-4">
            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Массакр</h3>
            <Form.Group>
              <Form.Label>Задержка, от 0 до 60 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={0}
                max={60}
                value={massacreDelay / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="massacreDelay"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Длительность, от 1 до 60 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={60}
                value={massacreDuration / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="massacreDuration"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
          </div>
          <div className="tw-m-4">
            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Ритуал</h3>
            <Form.Group>
              <Form.Label>Минимальное число участников, от 1 до 10</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={10}
                value={ritualMembersBoundary}
                className="tw-w-24 tw-text-right"
                data-prop-name="ritualMembersBoundary"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Задержка, от 0 до 60 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={0}
                max={60}
                value={ritualDelay / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="ritualDelay"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
          </div>
          <div className="tw-m-4">
            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Откат мощного заклинания</h3>
            <Form.Group>
              <Form.Label>Минимальная мощь закла, от 1 до 10</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={10}
                value={powerSpellBoundary}
                className="tw-w-24 tw-text-right"
                data-prop-name="powerSpellBoundary"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Задержка, от 0 до 60 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={0}
                max={60}
                value={powerSpellDelay / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="powerSpellDelay"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Длительность, от 1 до 60 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={60}
                value={powerSpellDuration / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="powerSpellDuration"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
          </div>
          <div className="tw-m-4">
            <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Input/Output Stream</h3>
            <Form.Group>
              <Form.Label>Длительность одной перекачки, от 1 до 10 мин</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={10}
                value={spellDurationItem / 60000}
                className="tw-w-24 tw-text-right"
                data-prop-name="spellDurationItem"
                data-multiplier="60000"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Вероятность применения на единицу мощи заклинания, от 5 до 100 процентов</Form.Label>
              <Form.Control
                type="number"
                step={5}
                min={5}
                max={100}
                value={spellProbabilityPerPower}
                className="tw-w-24 tw-text-right"
                data-prop-name="spellProbabilityPerPower"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Длительность заклинания на единицу мощи заклинания, от 1 до 10</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={10}
                value={spellDurationPerPower}
                className="tw-w-24 tw-text-right"
                data-prop-name="spellDurationPerPower"
                onChange={this.onChange}
              />
            </Form.Group>
          </div>
        </div>
      </div>
    );
  }
}
