import React, { Component } from 'react';
import './MusicSelectControl.css';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight, faTimes, faChevronRight, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { MusicSelectControlPropTypes } from '../../types';

const values = [{
  key: 'high',
  name: 'manahigh',
}, {
  key: 'normal',
  name: 'mananormal',
}, {
  key: 'low',
  name: 'manalow',
}];

export class MusicSelectControl extends Component {
  static propTypes = MusicSelectControlPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };

    // this.onSelectClick = this.onSelectClick.bind(this);
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
  }

  componentDidMount = () => {
    const { gameModel } = this.props;
    gameModel.on('soundLoaded', this.onSoundUpdate);
    gameModel.on('soundsRemoved', this.onSoundUpdate);
    gameModel.on('soundToKeySet', this.onSoundToKeySet);
    this.setState({
      sounds: gameModel.get('sounds'),
      soundMapping: gameModel.get('soundMapping'),
      initialized: true,
    });
    console.log('MusicSelectControl mounted');
  }

  componentDidUpdate = (prevProps) => {
    const { gameModel } = this.props;
    if (prevProps.gameModel !== this.props.gameModel) {
      prevProps.gameModel.off('soundLoaded', this.onSoundUpdate);
      prevProps.gameModel.off('soundsRemoved', this.onSoundUpdate);
      prevProps.gameModel.off('soundToKeySet', this.onSoundToKeySet);
      gameModel.on('soundLoaded', this.onSoundUpdate);
      gameModel.on('soundsRemoved', this.onSoundUpdate);
      gameModel.on('soundToKeySet', this.onSoundToKeySet);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        sounds: gameModel.get('sounds'),
        soundMapping: gameModel.get('soundMapping'),
      });
    }
    console.log('MusicSelectControl did update');
  }

  componentWillUnmount = () => {
    const { gameModel } = this.props;
    gameModel.off('soundLoaded', this.onSoundUpdate);
    gameModel.off('soundsRemoved', this.onSoundUpdate);
    gameModel.off('soundToKeySet', this.onSoundToKeySet);
    console.log('MusicSelectControl will unmount');
  }

  onSoundToKeySet({ key, keyType, soundName }) {
    this.setState(({ soundMapping }) => ({
      soundMapping: {
        // ...soundMapping,
        [keyType]: {
          ...soundMapping[keyType],
          [key]: soundName,
        },
      },
    }));
  }

  onSoundUpdate(e) {
    const { gameModel } = this.props;
    this.setState({
      sounds: gameModel.get('sounds'),
    });
  }

  mapSoundToKey(key, name) {
    const { gameModel } = this.props;
    gameModel.execute({
      type: 'mapSoundToKey',
      key,
      keyType: 'manaLevels',
      soundName: name,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      soundMapping, initialized, sounds,
    } = this.state;
    if (!initialized) {
      return null;
    }
    const { manaLevels } = soundMapping;
    const { t } = this.props;

    return (
      <Accordion className="MusicSelectControl">
        {
          values.map((value, i) => (
            <Card kay={value.key}>
              <Accordion.Toggle as={Card.Header} eventKey={String(i)} className="text-base">
                <span className="text-gray-600">{`${t('manaLevel')}:`}</span>
                {' '}
                {t(value.name)}
                <br />
                {manaLevels[value.key] || <span className="text-gray-600">{t('noSound')}</span>}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(i)}>
                <Card.Body style={{ maxHeight: '20rem', overflow: 'auto' }} onScroll={(e) => e.stopPropagation()}>
                  <ul>
                    {
                      sounds.map((sound) => (
                        <li key={sound.name}>
                          <Button
                            variant="outline-dark"
                            className="w-full text-left mb-2"
                            onClick={() => this.mapSoundToKey(value.key, sound.name)}
                          >
                            <FontAwesomeIcon
                              className={classNames('mr-1 text-base w-4 h-4 ', {
                                invisible: manaLevels[value.key] !== sound.name,
                              })}
                              fixedWidth
                              icon={faCheck}
                            />
                            {sound.name}
                          </Button>
                        </li>
                      ))
                    }
                  </ul>

                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))
        }
      </Accordion>
    );
  }
}
