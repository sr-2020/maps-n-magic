import React, { Component } from 'react';
import './CharacterHealthListener.css';

import * as R from 'ramda';

// import { CharacterHealthListenerPropTypes } from '../../types';

const REQUEST_TIMEOUT = 5000;

export class CharacterHealthListener extends Component {
  // static propTypes = CharacterHealthListenerPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.characterChangeIntervalId = setInterval(() => {
      this.loadCharacterStates();
    }, REQUEST_TIMEOUT);
    console.log('CharacterHealthListener mounted');
  }

  componentDidUpdate() {
    console.log('CharacterHealthListener did update');
  }

  componentWillUnmount() {
    clearInterval(this.characterChangeIntervalId);
    console.log('CharacterHealthListener will unmount');
  }

  loadCharacterStates() {
    // const { gameModel } = this.props;
    // const characterId = randomInteger(1, 10);

    // const locations = gameModel.get('locationRecords').filter(isGeoLocation);
    // // console.log(locations);

    // gameModel.execute({
    //   type: 'setCharacterHealthState',
    //   characterId,
    //   characterHealthState: {
    //     locationId: getRandomEl(locations).id,
    //     healthState: getRandomEl(healthStates),
    //   },
    // });
    // fetch('http://localhost:3001/characterStates')
    fetch('/characterStates')
      .then((result) => {
        if (!result.ok) throw new Error(result);
        return result.json();
      }).then((result) => {
        // console.log(result);
        // console.log(`Sound list fetched ${result.entries.length}`);
        // this._updateSounds(result);
        this.updateCharacterStates(result);
      }).catch((error) => {
        console.error(error);
      });
  }

  updateCharacterStates(newStates) {
    const { gameModel } = this.props;
    const oldStates = gameModel.get('characterHealthStates');
    const newCharacterIds = R.keys(newStates);
    const oldCharacterIds = R.keys(oldStates);
    const newIds = R.difference(newCharacterIds, oldCharacterIds);

    const postUpdate = (characterId) => {
      gameModel.execute({
        type: 'setCharacterHealthState',
        characterId,
        characterHealthState: {
          ...newStates[characterId],
        },
      });
    };

    newIds.forEach(postUpdate);

    const intersection = R.intersection(newCharacterIds, oldCharacterIds);
    const changes = intersection.filter((characterId) => !R.equals(newStates[characterId], oldStates[characterId]));

    changes.forEach(postUpdate);
  }


  render() {
    return null;
  }
}
