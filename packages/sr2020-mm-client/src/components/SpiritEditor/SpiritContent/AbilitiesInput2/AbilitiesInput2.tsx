import React, { FormEvent } from 'react';
import './AbilitiesInput2.css';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { WithFeatures } from '../../../../dataHOCs';

import { WithTranslation } from "react-i18next";
import { GameModel, GetFeatures, GetFeature } from 'sr2020-mm-event-engine';

interface AbilitiesInput2Props extends WithTranslation, WithFeatures {
  id: string;
  abilities: string[];
  gameModel: GameModel;
  onChange: (abilities: string[]) => void;
}

export function AbilitiesInput2(props: AbilitiesInput2Props) {
  const { 
    abilities, 
    t, 
    features, 
    gameModel, 
    id, 
    onChange 
  } = props;

  if (features === null) {
    return (
      <div>
        Фичи загружаются...
      </div>
    )
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    if (form.checkValidity() === true) {
      const ability = form[id].value.trim();
      const feature = gameModel.get2<GetFeature>({
        type: 'feature',
        id: ability
      });
      if (!abilities.includes(ability) && feature !== undefined) {
        const newAbilities = [...abilities, ability];
        newAbilities.sort();
        onChange(newAbilities);
        form[id].value = '';
      }
    }
  }

  function removeAbility(ability: string) {
    const newAbilities = abilities.filter((ab) => ab !== ability);
    onChange(newAbilities);
  }

  return (
    <div className="AbilitiesInput2">
      <Form 
        onSubmit={onSubmit}
      >
        <InputGroup className="tw-mb-3">
          <FormControl required id={id} list="abilities-datalist" />
          <InputGroup.Append>
            <Button type="submit" variant="outline-secondary">{t('addAbility')}</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      <div>
        {abilities.map((ability) => (
          <ButtonGroup key={ability} className="tw-mr-2 tw-mb-2">
            <Button variant="secondary">{ability}</Button>
            <Button variant="secondary" onClick={
              () => removeAbility(ability)
            }>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </ButtonGroup>
        ))}


      </div>
      <datalist id="abilities-datalist">
        {
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
          // datalistAbilities.map((ability) => <option key={ability} value={ability} />)
          features.map((feature) => <option key={feature.id} value={feature.id}>{feature.humanReadableName}</option>)
        }
      </datalist>
    </div>
  );
}


