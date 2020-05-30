import React, { Component } from 'react';
import './CharacterHealthListener.css';

import * as R from 'ramda';

import { getCharacterStates } from '../../api/characterStates';

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
    getCharacterStates().then((result) => {
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
