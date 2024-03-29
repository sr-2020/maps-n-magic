import React, { useEffect } from 'react';
import './SpiritList.css';
import * as R from 'ramda';
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useHistory } from 'react-router-dom';

import { WithLocationDataOnly } from '../../hocs';
import { 
  getFractionName, 
  t,
  spiritListTitle,
  needAbilityToCatchSpirit,
  catchSpiritInfoText,
  processForDisplay,
} from '../../utils';
import { SpiritCard } from "../SpiritCard";
import { Ability, CharacterModelData2, hasAbility, hasSpell, Spell } from 'sr2020-mm-event-engine';
import moment from 'moment';

interface SpiritListProps extends WithLocationDataOnly {
  setTitle: (title: string) => void;
  characterData: CharacterModelData2;
}

const spiritMasterMap: Record<number, Ability> = {
  1: Ability.SpiritMaster1,
  2: Ability.SpiritMaster2,
  3: Ability.SpiritMaster3,
};

const spiritMasterNames: Record<number, string> = {
  1: 'Spirit Apprentice (P)',
  2: 'Spirit Disciple (P)',
  3: 'Spirit Master (P)',
};

export function SpiritList(props: SpiritListProps) {
  const { locationData, setTitle, characterData } = props;
  const history = useHistory();
  
  useEffect(() => {
    setTitle(spiritListTitle(locationData?.spiritViews.length || 0))
  }, [locationData?.spiritViews.length]);
  
  if (!locationData) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">{t('locationIsUnknown')}</h2>
      </div>
    );
  }

  if (!hasSpell(characterData, Spell.SpiritCatcher)) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16">{t('missingSpiritCatcherSpell')}</h2>
      </div>
    );
  }

  const { spiritViews } = locationData;

  if (spiritViews.length === 0) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">{t('noSpiritsInLocation')}</h2>
      </div>
    );
  }

  const sortedSpiritViews = R.sortBy((el) => el.name.toLowerCase(), spiritViews);
  
  return (
    <div className="SpiritList">
      {
        characterData.catcherData !== undefined &&
        <div className="tw-m-4 tw-p-4 tw-bg-green-200 tw-font-semibold">
          {catchSpiritInfoText(
            characterData.catcherData.attemptNumber,
            moment(characterData.catcherData.startTime + 
              characterData.catcherData.durationMillis).format('HH:mm'),
            characterData.catcherData.catchProbability
          )}
        </div>
      }
      {
        characterData.catcherData === undefined &&
        <div className="tw-m-4 tw-p-4 tw-bg-blue-200 tw-font-semibold">
          {t('castSpiritCatcherAdvice')}
        </div>
      }
      <Accordion>
        {
          sortedSpiritViews.map((spiritView, index) => 
            <Card key={spiritView.id}>
              <Accordion.Toggle as={Card.Header} eventKey={String(index)}>
                <div>{processForDisplay(spiritView.name)}</div>
                <div className="text-muted tw-text-sm">{processForDisplay(getFractionName(spiritView.fraction))}</div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(index)}>
                <Card.Body>
                  <SpiritCard
                    spirit={spiritView}
                    characterData={characterData}
                  />
                  {
                    hasAbility(characterData, spiritMasterMap[spiritView.level]) &&
                    characterData.catcherData !== undefined &&
                    <Button 
                      variant="outline-primary" 
                      className="tw-w-full tw-text-left tw-py-4 tw-mb-2"
                      onClick={() => history.push(`/catchSpirit/${spiritView.id}`)}
                    >
                      {t('catch')}
                    </Button>
                  }
                  {
                    !hasAbility(characterData, spiritMasterMap[spiritView.level]) &&
                    <div>
                      {needAbilityToCatchSpirit(spiritMasterNames[spiritView.level])}
                    </div>
                  }
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        }
      </Accordion>
    </div>
  );
}



