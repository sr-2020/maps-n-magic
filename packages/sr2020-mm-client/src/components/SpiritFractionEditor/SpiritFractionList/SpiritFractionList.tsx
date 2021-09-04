import React from 'react';
import './SpiritFractionList.css';
import * as R from 'ramda';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';
import { WithSpiritFractions } from '../../../dataHOCs';
import { EntitiyListItem, EntityList, makeLinkGenerator } from '../../EntityList';
import { processForDisplay } from 'sr2020-mm-translations';

const spiritFractionLink = makeLinkGenerator('spiritFractionEditor');

interface SpiritFractionListProps extends WithTranslation, WithSpiritFractions {
  gameModel: GameModel;
}

function spiritFractionsToListItems(props: SpiritFractionListProps): EntitiyListItem[] {
  const { spiritFractions, t } = props;
  if (spiritFractions === null) {
    return [];
  }
  const fractionIndex = R.indexBy(R.prop('id'), spiritFractions);
  const items: EntitiyListItem[] = spiritFractions.map(spiritFraction => ({
    id: spiritFraction.id,
    title: processForDisplay(spiritFraction.name),
    subtitle: ''
  }));
  return items;
}


export function SpiritFractionList(props: SpiritFractionListProps) {
  const items = spiritFractionsToListItems(props);

  return (
    <EntityList
      className="SpiritFractionList"
      items={items}
      makeLink={spiritFractionLink}
      linkRoot="spiritEditor"
      createControlTitle="newSpirit"
      createFormTitle="enterSpiritName"
      createSubmitButtonText="createSpirit"
      findEntity="findSpiritFraction"
      noEntitiesAdvice="createSpirits"
    />
  );
}



