import React, { Component } from 'react';
import './MusicSelect.css';
import ReactDOM from 'react-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight, faTimes, faChevronRight, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import { MusicSelectPropTypes } from '../../../types';

import { musicSelectDom } from '../../../utils/domUtils';

export class MusicSelect extends Component {
  static propTypes = MusicSelectPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      // show: true,
      show: false,
      initialized: false,
    };

    this.onSelectClick = this.onSelectClick.bind(this);
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
    console.log('MusicSelect mounted');
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
    console.log('MusicSelect did update');
  }

  componentWillUnmount = () => {
    const { soundService } = this.props;
    soundService.off('soundsUpdate', this.onSoundUpdate);
    soundService.off('soundToKeySet', this.onSoundToKeySet);
    console.log('MusicSelect will unmount');
  }


  onSoundUpdate(e) {
    const { soundService } = this.props;
    this.setState({
      sounds: soundService.getSounds(),
    });
  }

  onSoundToKeySet({ key, soundName }) {
    this.setState(({ soundMapping }) => ({
      soundMapping: {
        ...soundMapping,
        [key]: soundName,
      },
    }));
  }


  onSelectClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState((state) => ({
      show: !state.show,
    }));
    // return false;
  }

  mapSoundToKey(key, name) {
    const { soundService } = this.props;
    soundService.mapSoundToKey(key, name);
  }

  // eslint-disable-next-line max-lines-per-function
  makeContent() {
    const {
      show, soundMapping, initialized, sounds,
    } = this.state;
    if (!initialized) {
      return null;
    }
    const { t } = this.props;
    // console.log(this.props);
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
    return (
      <div className="MusicSelect relative text-right">
        <button
          type="button"
          className="text-base bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 pl-3 pr-2 rounded focus:outline-none focus:shadow-outline"
          onClick={this.onSelectClick}
        >
          <span>{t('selectMusic')}</span>
          <FontAwesomeIcon className="ml-1 text-base w-4 h-4" fixedWidth icon={show ? faTimes : faChevronRight} />
        </button>
        <div className={classNames('button-panel relative  text-left', {
          'hidden-panel': !show,
        })}
        >
          <Accordion>
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
                            <li>
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
        </div>

      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      this.makeContent(),
      musicSelectDom,
    );
  }

  // render() {
  //   const { something } = this.state;
  //   // const { t } = this.props;

  //   if (!something) {
  //     return <div> MusicSelect stub </div>;
  //     // return null;
  //   }
  //   return (
  //     <div className="MusicSelect">
  //       MusicSelect body
  //     </div>
  //   );
  // }
}
