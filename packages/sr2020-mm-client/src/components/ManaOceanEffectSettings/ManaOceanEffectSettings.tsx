import React, { ChangeEvent, Component } from 'react';
import './ManaOceanEffectSettings.css';
import * as R from 'ramda';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { prop } from 'ramda';
import { WithTranslation } from "react-i18next";
import { WithManaOceanEffectSettings } from "../../dataHOCs";

import {
  GameModel,
  PostSettings
} from 'sr2020-mm-event-engine';

interface ManaOceanEffectSettingsProps extends WithTranslation, WithManaOceanEffectSettings {
  gameModel: GameModel;
}

export class ManaOceanEffectSettings extends Component<ManaOceanEffectSettingsProps> {
  changeTimeoutId: NodeJS.Timeout | undefined;
  
  constructor(props: ManaOceanEffectSettingsProps) {
    super(props);
    this.state = {
    };
    this.onChange = this.onChange.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  onChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    const { propName, multiplier } = event.currentTarget.dataset;
    const multiplier2 = Number(multiplier || 1);
    const numberValue = (Number(value) * multiplier2);
    if (Number.isNaN(numberValue)) {
      return;
    }

    switch (propName) {
    case 'massacreDelay':
    case 'massacreManaChange':
    case 'massacrePeopleLimit':
    case 'powerSpellDelay':
    case 'ritualDelay':
      if (numberValue < 0) {
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
      if (numberValue <= 0) {
        return;
      }
      break;
    default:
      throw new Error(`Unexpected propName: ${propName}`);
    }

    // console.log('propName', propName, value);

    const { manaOceanEffects, gameModel } = this.props;

    if (this.changeTimeoutId !== undefined) {
      clearTimeout(this.changeTimeoutId);
    }

    this.changeTimeoutId = setTimeout(() => {
      gameModel.execute2<PostSettings>({
        type: 'postSettings',
        name: 'manaOceanEffects',
        settings: {
          ...manaOceanEffects,
          [propName]: numberValue,
        },
      });
    }, 500);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
    } = this.state;
    const { t, manaOceanEffects } = this.props;
    if (manaOceanEffects === undefined || manaOceanEffects.massacreDelay === undefined) {
      return null;
    }
    const {
      massacreDelay,
      massacreDuration,
      massacreManaChange,
      massacrePeopleLimit,
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
            <Form.Group>
              <Form.Label>Эффект на ману, от 1 до 5</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={5}
                value={massacreManaChange}
                className="tw-w-24 tw-text-right"
                data-prop-name="massacreManaChange"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Число людей, от 1 до 10</Form.Label>
              <Form.Control
                type="number"
                step={1}
                min={1}
                max={10}
                value={massacrePeopleLimit}
                className="tw-w-24 tw-text-right"
                data-prop-name="massacrePeopleLimit"
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
