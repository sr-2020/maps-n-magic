import React, { useEffect } from 'react';
import './CharacterPage.css';

import { WithLoginState, WithCharacterDataOnly } from '../../hocs';
import { BodyType, HealthState } from 'sr2020-mm-event-engine';

interface CharacterPageProps extends WithCharacterDataOnly {
  setTitle: (title: string) => void;
}

const bodyTypeLabel: Record<BodyType, string> = {
  astral: 'Астральное',
  physical: 'Мясное',
  drone: 'Дрон',
  ectoplasm: 'Эктоплазменное',
  vr: 'VR',
}

const healthStateLabel: Record<HealthState, string> = {
  healthy: 'Здоров',
  wounded: 'Тяжело ранен',
  clinically_dead: 'КС',
  biologically_dead: 'АС',
}

export function CharacterPage(props: CharacterPageProps) {
  const { characterData, setTitle } = props;

  useEffect(() => {
    setTitle(`Персонаж`);
  }, []);

  if (characterData === null) {
    return <div>Данные персонажа загружаются</div>
  }

  return (
    <div className="CharacterPage tw-p-4">
      <div className="tw-mb-2">
        <span className="tw-w-24 tw-inline-block">Тело</span><span>{bodyTypeLabel[characterData.workModel.currentBody]}</span>
      </div>
      <div>
        <span className="tw-w-24 tw-inline-block">Состояние</span><span>{healthStateLabel[characterData.workModel.healthState]}</span>
      </div>
    </div>
  );
}
