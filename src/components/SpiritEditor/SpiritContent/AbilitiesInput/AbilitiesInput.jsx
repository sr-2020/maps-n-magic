import React, { Component } from 'react';
import './AbilitiesInput.css';

// import { AbilitiesInputPropTypes } from '../../types';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as R from 'ramda';

const sort = R.sortBy(R.toLower);

export class AbilitiesInput extends Component {
  // static propTypes = AbilitiesInputPropTypes;

  constructor(props) {
    super(props);
    const { id, spiritService } = props;
    this.state = {
      abilities: sort(spiritService.getSpirit(id).abilities),
      allAbilities: spiritService.getSpiritAbilitiesList(),
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    console.log('AbilitiesInput mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.id === this.props.id) {
      return;
    }
    const {
      id, spiritService,
    } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      abilities: spiritService.getSpirit(id).abilities,
      allAbilities: spiritService.getSpiritAbilitiesList(),
    });
    // console.log('AbilitiesInput did update');
  }

  componentWillUnmount = () => {
    console.log('AbilitiesInput will unmount');
  }

  onSubmit(e) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    console.log('onsubmit');
    const { abilities } = this.state;
    const { id, spiritService } = this.props;
    if (form.checkValidity() === true) {
      const ability = form.newAbility.value.trim();
      if (!abilities.includes(ability)) {
        spiritService.putSpirit(id, {
          abilities: [...abilities, ability],
        });
        this.setState(({ abilities }) => ({
          abilities: sort([...abilities, ability]),
          allAbilities: spiritService.getSpiritAbilitiesList(),
        }));
        form.newAbility.value = '';
      }
      // this.createNewSpirit(form.spiritName.value);
    }
  }

  removeAbility(e, ability) {
    const { id, spiritService } = this.props;
    const { abilities } = this.state;
    const newAbilities = abilities.filter((ab) => ab !== ability);
    spiritService.putSpirit(id, {
      abilities: newAbilities,
    });
    this.setState(({ abilities }) => ({
      abilities: abilities.filter((ab) => ab !== ability),
      allAbilities: spiritService.getSpiritAbilitiesList(),
    }));
  }

  render() {
    const { abilities, allAbilities } = this.state;
    const { t, className, inputId } = this.props;

    const datalistAbilities = sort(R.difference(allAbilities, abilities));

    // if (!something) {
    //   return <div> AbilitiesInput stub </div>;
    //   // return null;
    // }
    const className2 = classNames('AbilitiesInput', className);
    return (
      <div className={className2}>
        <Form onSubmit={this.onSubmit}>
          <InputGroup className="mb-3">
            <FormControl required id="newAbility" list="abilities-datalist" />
            <InputGroup.Append>
              <Button type="submit" variant="outline-secondary">Add ability</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <div>
          {abilities.map((ability) => (
            <ButtonGroup className="mr-2 mb-2">
              <Button variant="secondary">{ability}</Button>
              <Button variant="secondary" onClick={(e) => this.removeAbility(e, ability)}><FontAwesomeIcon icon={faTimes} /></Button>
            </ButtonGroup>
          ))}


        </div>
        <datalist id="abilities-datalist">
          {
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
            datalistAbilities.map((ability) => <option key={ability} value={ability} />)
          }
        </datalist>
      </div>
    );
  }
}
