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
    const { soundService } = this.props;
    soundService.on('soundsUpdate', this.onSoundUpdate);
    soundService.on('soundToKeySet', this.onSoundToKeySet);
    this.setState({
      sounds: soundService.getSounds(),
      soundMapping: soundService.getSoundMapping(),
      initialized: true,
    });
    console.log('MusicSelectControl mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.soundService !== this.props.soundService) {
      prevProps.soundService.off('soundsUpdate', this.onSoundUpdate);
      prevProps.soundService.off('soundToKeySet', this.onSoundToKeySet);
      this.props.soundService.on('soundsUpdate', this.onSoundUpdate);
      this.props.soundService.on('soundToKeySet', this.onSoundToKeySet);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        sounds: this.props.soundService.getSounds(),
        soundMapping: this.props.soundService.getSoundMapping(),
      });
    }
    console.log('MusicSelectControl did update');
  }

  componentWillUnmount = () => {
    const { soundService } = this.props;
    soundService.off('soundsUpdate', this.onSoundUpdate);
    soundService.off('soundToKeySet', this.onSoundToKeySet);
    console.log('MusicSelectControl will unmount');
  }

  onSoundToKeySet({ key, soundName }) {
    this.setState(({ soundMapping }) => ({
      soundMapping: {
        ...soundMapping,
        [key]: soundName,
      },
    }));
  }

  onSoundUpdate(e) {
    const { soundService } = this.props;
    this.setState({
      sounds: soundService.getSounds(),
    });
  }


  // onSelectClick(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.setState((state) => ({
  //     show: !state.show,
  //   }));
  //   // return false;
  // }

  mapSoundToKey(key, name) {
    const { soundService } = this.props;
    soundService.mapSoundToKey(key, name);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      soundMapping, initialized, sounds,
    } = this.state;
    if (!initialized) {
      return null;
    }
    const { t } = this.props;

    return (
      // <div className="MusicSelectControl">
      //   MusicSelectControl body
      // </div>
      <Accordion className="MusicSelectControl">
        {
          values.map((value, i) => (
            <Card kay={value.key}>
              <Accordion.Toggle as={Card.Header} eventKey={String(i)} className="text-base">
                <span className="text-gray-600">{`${t('manaLevel')}:`}</span>
                {' '}
                {t(value.name)}
                <br />
                {soundMapping[value.key] || <span className="text-gray-600">{t('noSound')}</span>}
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
                                invisible: soundMapping[value.key] !== sound.name,
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
