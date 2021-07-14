import React, { useEffect } from 'react';
import './SpiritList.css';
import * as R from 'ramda';
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useHistory } from 'react-router-dom';

import { WithLocationDataOnly } from '../../hocs';
import { getFractionName } from '../../utils';
import { SpiritCard } from "../SpiritCard";
import { Ability, CharacterModelData2, hasAbility } from 'sr2020-mm-event-engine';

interface SpiritListProps extends WithLocationDataOnly {
  setTitle: (title: string) => void;
  characterData: CharacterModelData2;
}

export function SpiritList(props: SpiritListProps) {
  const { locationData, setTitle, characterData } = props;
  const history = useHistory();
  
  useEffect(() => {
    setTitle(`Духи (${locationData?.spiritViews.length || 0})`)
  }, [locationData?.spiritViews.length]);
  
  if (!locationData) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">Локация неизвестна</h2>
      </div>
    );
  }

  if (!hasAbility(characterData, Ability.OwnSpirit)) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16">Вы не овладели навыком Own spirit, поэтому не видите духов вокруг и не можете их поймать</h2>
      </div>
    );
  }

  const { spiritViews } = locationData;

  if (spiritViews.length === 0) {
    return (
      <div className="tw-text-center">
        <h2 className="tw-my-16 tw-text-2xl">В локации нет духов</h2>
      </div>
    );
  }

  const sortedSpiritViews = R.sortBy((el) => el.name.toLowerCase(), spiritViews);
  
  return (
    <div className="SpiritList">
      <Accordion>
        {
          sortedSpiritViews.map((spiritView, index) => 
            <Card key={spiritView.id}>
              <Accordion.Toggle as={Card.Header} eventKey={String(index)}>
                <div>{spiritView.name}</div>
                <div className="text-muted tw-text-sm">{getFractionName(spiritView.fraction)}</div>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(index)}>
                <Card.Body>
                  <SpiritCard
                    spirit={spiritView}
                    characterData={characterData}
                  />
                  <Button 
                    variant="outline-primary" 
                    className="tw-w-full tw-text-left tw-py-4 tw-mb-2"
                    onClick={() => history.push(`/catchSpirit/${spiritView.id}`)}
                  >
                    Поймать
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        }
      </Accordion>
    </div>
  );
}



