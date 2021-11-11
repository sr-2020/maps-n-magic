import React from 'react';
import { Ability, CharacterModelData2, hasAbility, Spirit } from 'sr2020-mm-event-engine';
import classNames from 'classnames';

import { getFractionName, t, processForDisplay } from '../../utils';
import './SpiritCard.css';

interface SpiritCardProps {
  spirit: Spirit;
  className?: string;
  characterData: CharacterModelData2;
}

export function SpiritCard(props: SpiritCardProps) {
  const { spirit, className, characterData } = props;
  
  return (
    <div className={classNames("SpiritCard", className)}>
      <div className="tw-mb-4">
        {processForDisplay(spirit.name)}
      </div>
      {/* <div>
        {getFractionName(spirit.fraction)}-{spirit.level}
      </div> */}
      <div className="tw-mb-4">
        <span className="tw-inline-block tw-w-16">{t('hitPoints')}</span>
        <span>{spirit.hitPoints}</span>
      </div>
      <div className="tw-mb-4">
        <span className="tw-inline-block tw-w-16">{t('level')}</span>
        <span>{spirit.level}</span>
      </div>
      {
        hasAbility(characterData, Ability.FineHearing) && 
        <div className="tw-mb-4">
          <div className="tw-mb-2">{t('abilities')}</div>
          <div>
            {
              spirit.abilities.map(el => 
                <span className="tw-inline-block tw-mr-4">{el}</span>
              )
            }
          </div>
        </div>
      }
    </div>
  );
}



