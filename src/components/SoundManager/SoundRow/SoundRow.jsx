import React, { Component } from 'react';
import './SoundRow.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle, faMusic, faStopCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { formatBytes, formatDuration } from '../../../utils/miscUtils';

// import { SoundRowPropTypes } from '../../types';

export class SoundRow extends Component {
  // static propTypes = SoundRowPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    console.log('SoundRow mounted');
  }

  componentDidUpdate = () => {
    console.log('SoundRow did update');
  }

  componentWillUnmount = () => {
    console.log('SoundRow will unmount');
  }

  getActiveIcon(sound) {
    return faPlayCircle;
    // if (sound.status === 'loading') {
    //   return faSpinner;
    // }
    // const { soundService } = this.props;
    // const isPlayingSound = soundService.isPlayingSound(sound.name);
    // return isPlayingSound ? faStopCircle : faPlayCircle;
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    // const { something } = this.state;
    const {
      sound, isSelected, selectBackgroundSound, selectRotationSound, t,
      isInRotation, isBackground, playbackIndex,
    } = this.props;

    // if (!something) {
    //   return <div> SoundRow stub </div>;
    //   // return null;
    // }
    return (
      <div className="SoundRow flex">
        <button
          type="button"
          className={
            classNames('rounded my-1 h-12 flex music-control-button hover:bg-gray-200 w-full flex items-center', {
              selected: isSelected,
            })
          }

          onClick={() => selectBackgroundSound(sound.name)}
        >
          <div className="w-10 h-10 ml-1 bg-gray-300 rounded flex icon-container">
            <FontAwesomeIcon className="text-gray-600 music-icon m-auto text-2xl" icon={faMusic} />
            <FontAwesomeIcon
              className="text-gray-600 play-icon m-auto text-2xl text-white"
              icon={this.getActiveIcon(sound)}
              spin={sound.status === 'loading'}
            />
          </div>
          <div className="text-left">
            <div className="leading-none">
              <span className="ml-2 pt-1 font-medium text-sm">{sound.name}</span>
            </div>
            <div>
              <span className="ml-2 pt-1 text-sm text-gray-600">{formatBytes(sound.size)}</span>
              <span className="ml-2 pt-1 text-sm text-gray-600">{sound.buffer && formatDuration(sound.buffer.duration)}</span>
              <span className="ml-2 pt-1 text-sm text-gray-600">{sound.status}</span>
            </div>
          </div>
        </button>
        <button
          type="button"
          className={
            classNames('rounded my-1 h-12 flex music-control-button hover:bg-gray-200 w-full flex items-center', {
              selected: isSelected,
            })
          }

          onClick={() => selectBackgroundSound(sound.name)}
          // onClick={() => selectBackgroundSound(sound.name)}
        >
          {/* <div className="w-10 h-10 ml-1 bg-gray-300 rounded flex icon-container">
            <FontAwesomeIcon className="text-gray-600 music-icon m-auto text-2xl" icon={faMusic} />
            <FontAwesomeIcon
              className="text-gray-600 play-icon m-auto text-2xl text-white"
              icon={this.getActiveIcon(sound)}
              spin={sound.status === 'loading'}
            />
          </div> */}
          <div className="text-left">
            <div className="leading-none">
              <span className="ml-2 pt-1 font-medium text-sm">{t(isBackground ? 'isBackground' : 'setToBackground')}</span>
            </div>
            <div>
              {/* <span className="ml-2 pt-1 text-sm text-gray-600">{formatBytes(sound.size)}</span> */}
              <span className="ml-2 pt-1 text-sm text-gray-600" />
            </div>
          </div>
        </button>
        <button
          type="button"
          className={
            classNames('rounded my-1 h-12 flex music-control-button hover:bg-gray-200 w-full flex items-center', {
              selected: isSelected,
            })
          }

          onClick={() => selectRotationSound(sound.name)}
          // onClick={() => selectBackgroundSound(sound.name)}
        >
          {/* <div className="w-10 h-10 ml-1 bg-gray-300 rounded flex icon-container">
            <FontAwesomeIcon className="text-gray-600 music-icon m-auto text-2xl" icon={faMusic} />
            <FontAwesomeIcon
              className="text-gray-600 play-icon m-auto text-2xl text-white"
              icon={this.getActiveIcon(sound)}
              spin={sound.status === 'loading'}
            />
          </div> */}
          <div className="text-left">
            <div className="leading-none">
              <span className="ml-2 pt-1 font-medium text-sm">{t(isInRotation ? 'inRotation' : 'addToRotation')}</span>
            </div>
            <div>
              {/* <span className="ml-2 pt-1 text-sm text-gray-600">{formatBytes(sound.size)}</span> */}
              <span className="ml-2 pt-1 text-sm text-gray-600">
                {playbackIndex !== -1 && t(playbackIndex === 0 ? 'playingNow' : 'queuePlace', {
                  index: playbackIndex,
                })}
              </span>
            </div>
          </div>
        </button>
      </div>
    );
  }
}
