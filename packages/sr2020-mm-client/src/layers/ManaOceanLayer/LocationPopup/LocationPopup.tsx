import React, { Component, KeyboardEvent, MouseEvent } from 'react';
import './LocationPopup.css';
import * as R from 'ramda';
import { WithTranslation } from "react-i18next";

import ReactDOM from 'react-dom';
// import classNames from 'classnames';
import moment from 'moment-timezone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

// import FormControl from 'react-bootstrap/FormControl';
import { 
  LocationRecordOptions, 
  GameModel,
  ManaOceanEffect
} from "sr2020-mm-event-engine";

interface LocationPopupProps extends WithTranslation {
  onClose: () => void;
  id: number;
  locOptions: LocationRecordOptions;
  gameModel: GameModel;
  locationPopupDom: HTMLElement;
}

export class LocationPopup extends Component<
  LocationPopupProps
> {
  constructor(props: LocationPopupProps) {
    super(props);
    this.state = {
    };
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  componentDidMount = () => {
  }

  componentDidUpdate = () => {
  }

  _handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.props.onClose();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      t, id, locOptions, gameModel,
    } = this.props;

    const { effectList } = locOptions;

    const common = 'w-33p tw-font-bold tw-py-2 tw-px-4 focus:tw-outline-none focus:tw-shadow-outline';
    const selectedButton = 'tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white';
    const unselectedButton = 'tw-bg-gray-300 hover:tw-bg-gray-400 tw-text-gray-800';

    function getEffectLabel(effect: ManaOceanEffect): string {
      const str = t(`manaEffect_${effect.type}` as const);
      const startStr = moment(effect.start).format('HH:mm');
      const endStr = 'end' in effect ? (`-${moment(effect.end).format('HH:mm')}`) : '';
      return `${str}, ${startStr + endStr}, мана ${effect.manaLevelChange}`;
    }

    function onButtonClick(event: MouseEvent<HTMLElement>) {
      const { effectId } = event.currentTarget.dataset;
      gameModel.execute({
        type: 'removeManaEffect',
        effectId,
        locationId: id,
      });
      // console.log({
      //   type: 'removeManaEffect',
      //   effectId,
      //   locationId: id,
      // });
    }

    function onAddEffect(event: MouseEvent<HTMLElement>) {
      const { effectType } = event.currentTarget.dataset;
      gameModel.execute({
        type: 'addManaEffect',
        effectType,
        locationId: id,
      });
      // console.log({
      //   type: 'addManaEffect',
      //   effectType,
      //   locationId: id,
      // });
    }

    const sortedEffectList = R.sortBy(R.prop('start'), effectList);

    return (
      <div className="LocationPopup">
        <Button variant="primary" className="tw-mb-4" data-effect-type="massacre" onClick={onAddEffect}>
          {t('addMassacre')}
        </Button>
        <Button variant="primary" className="tw-mb-4" data-effect-type="powerSpell" onClick={onAddEffect}>
          {t('addCastRollback')}
        </Button>
        <div style={{ maxHeight: '16rem' }} className="tw-overflow-auto">
          {
            sortedEffectList.map((effect) => (
              <div key={effect.id} className="tw-flex tw-mb-4">
                <div className="tw-flex-1 tw-text-sm">{getEffectLabel(effect)}</div>
                <button type="button" data-effect-id={effect.id} onClick={onButtonClick}>
                  <FontAwesomeIcon
                    className="tw-text-base tw-text-gray-700"
                    icon={faTimes}
                  />
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  render() {
    const { locationPopupDom } = this.props;
    return ReactDOM.createPortal(
      this.makeContent(),
      locationPopupDom,
    );
  }
}
