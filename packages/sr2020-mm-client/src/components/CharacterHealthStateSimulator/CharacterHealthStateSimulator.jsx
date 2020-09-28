import React, { Component } from 'react';
import './CharacterHealthStateSimulator.css';

import * as R from 'ramda';

import { isGeoLocation } from 'sr2020-mm-event-engine/utils';

// import { CharacterHealthStateSimulatorPropTypes } from '../../types';

const healthStates = ['healthy', 'wounded', 'clinically_dead', 'biologically_dead'];

const CHARACTER_CHANGE_TIMEOUT = 1000;

// random number from min to (max+1)
function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function getRandomEl(arr) {
  return arr[randomInteger(0, arr.length - 1)];
}

export class CharacterHealthStateSimulator extends Component {
  // static propTypes = CharacterHealthStateSimulatorPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.characterChangeIntervalId = setInterval(() => {
      this.changeCharacterState();
    }, CHARACTER_CHANGE_TIMEOUT);
    console.log('CharacterHealthStateSimulator mounted');
  }

  componentDidUpdate() {
    console.log('CharacterHealthStateSimulator did update');
  }

  componentWillUnmount() {
    clearInterval(this.characterChangeIntervalId);
    console.log('CharacterHealthStateSimulator will unmount');
  }

  changeCharacterState() {
    const { gameModel } = this.props;
    const characterId = randomInteger(1, 10);

    const locations = gameModel.get('locationRecords').filter(isGeoLocation);
    // console.log(locations);

    gameModel.execute({
      type: 'putCharHealth',
      characterId,
      characterHealthState: {
        locationId: getRandomEl(locations).id,
        healthState: getRandomEl(healthStates),
      },
    });
  }

  render() {
    return null;
  }
}
