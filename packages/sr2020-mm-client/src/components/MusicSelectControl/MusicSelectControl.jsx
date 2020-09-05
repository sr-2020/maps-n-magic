import * as R from 'ramda';
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
// import { MusicSelectControlPropTypes } from '../../types';

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

const sort = R.sortBy(R.toLower);

export class MusicSelectControl extends Component {
  // static propTypes = MusicSelectControlPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };

    // this.onSelectClick = this.onSelectClick.bind(this);
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
    this.onSoundToKeySet = this.onSoundToKeySet.bind(this);
    this.onSoundMappingChange = this.onSoundMappingChange.bind(this);
    this.onFractionChange = this.onFractionChange.bind(this);
  }

  componentDidMount = () => {
    const { gameModel } = this.props;
    this.subscribe('on', gameModel);
    this.initialize();
    this.setState({
      initialized: true,
    });
    console.log('MusicSelectControl mounted');
  }

  componentDidUpdate = (prevProps) => {
    const { gameModel } = this.props;
    if (prevProps.gameModel !== this.props.gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.initialize();
    }
    console.log('MusicSelectControl did update');
  }

  componentWillUnmount = () => {
    const { gameModel } = this.props;
    this.subscribe('on', gameModel);
    console.log('MusicSelectControl will unmount');
  }

  // eslint-disable-next-line react/sort-comp
  initialize() {
    const { gameModel } = this.props;
    const fractions = gameModel.get('spiritFractionsList');
    this.setState({
      sounds: gameModel.get('sounds'),
      soundMapping: gameModel.get('soundMapping'),
      fractions: sort(fractions),
    });
  }

  subscribe(action, gameModel) {
    gameModel[action]('soundLoaded', this.onSoundUpdate);
    gameModel[action]('soundsRemoved', this.onSoundUpdate);
    gameModel[action]('soundToKeySet', this.onSoundToKeySet);
    gameModel[action]('soundMappingChange', this.onSoundMappingChange);
    gameModel[action]('fractionChange', this.onFractionChange);
  }

  onSoundToKeySet({ key, keyType, soundName }) {
    this.setState(({ soundMapping }) => {
      const prop = {
        ...soundMapping[keyType], [key]: soundName,
      };
      return {
        ...soundMapping,
        [keyType]: prop,
      };
    });
  }

  onSoundMappingChange(soundMapping) {
    this.setState({
      soundMapping,
    });
  }

  onFractionChange({ fractions }) {
    this.setState({
      fractions: sort(fractions),
    });
  }

  onSoundUpdate(e) {
    const { gameModel } = this.props;
    this.setState({
      sounds: gameModel.get('sounds'),
    });
  }

  mapSoundToKey(key, name, keyType) {
    const { gameModel } = this.props;
    gameModel.execute({
      type: 'mapSoundToKey',
      key,
      keyType,
      soundName: name,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      soundMapping, initialized, sounds, fractions,
    } = this.state;
    if (!initialized) {
      return null;
    }
    const { manaLevels, spiritFractions } = soundMapping;
    const { t } = this.props;

    return (
      <Accordion className="MusicSelectControl">
        {
          values.map((value, i) => (
            <Card kay={value.key}>
              <Accordion.Toggle as={Card.Header} eventKey={String(i)} className="tw-text-base">
                <span className="tw-text-gray-600">{`${t('manaLevel')}:`}</span>
                {' '}
                {t(value.name)}
                <br />
                {manaLevels[value.key] || <span className="tw-text-gray-600">{t('noSound')}</span>}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(i)}>
                <Card.Body style={{ maxHeight: '20rem', overflow: 'auto' }} onScroll={(e) => e.stopPropagation()}>
                  <ul>
                    {
                      sounds.map((sound) => (
                        <li key={sound.name}>
                          <Button
                            variant="outline-dark"
                            className="tw-w-full tw-text-left tw-mb-2"
                            onClick={() => this.mapSoundToKey(value.key, sound.name, 'manaLevels')}
                          >
                            <FontAwesomeIcon
                              className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
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
        {
          fractions.map((fraction, i) => (
            <Card kay={fraction}>
              <Accordion.Toggle as={Card.Header} eventKey={String(i + values.length)} className="text-base">
                <span className="tw-text-gray-600">{`${t('spiritFraction')}:`}</span>
                {' '}
                {t(fraction)}
                <br />
                {spiritFractions[fraction] || <span className="tw-text-gray-600">{t('noSound')}</span>}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={String(i + values.length)}>
                <Card.Body style={{ maxHeight: '20rem', overflow: 'auto' }} onScroll={(e) => e.stopPropagation()}>
                  <ul>
                    {
                      sounds.map((sound) => (
                        <li key={sound.name}>
                          <Button
                            variant="outline-dark"
                            className="tw-w-full tw-text-left tw-mb-2"
                            onClick={() => this.mapSoundToKey(fraction, sound.name, 'spiritFractions')}
                          >
                            <FontAwesomeIcon
                              className={classNames('tw-mr-1 tw-text-base tw-w-4 tw-h-4 ', {
                                invisible: spiritFractions[fraction] !== sound.name,
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
