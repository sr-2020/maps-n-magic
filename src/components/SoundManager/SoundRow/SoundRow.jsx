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
      <div className="SoundRow tw-flex">
        <button
          type="button"
          className={
            classNames('tw-rounded tw-my-1 tw-h-12 tw-flex music-control-button hover:tw-bg-gray-200 tw-w-full tw-flex tw-items-center', {
              selected: isSelected,
            })
          }

          onClick={() => selectBackgroundSound(sound.name)}
        >
          <div className="tw-w-10 tw-h-10 tw-ml-1 tw-bg-gray-300 tw-rounded tw-flex icon-container">
            <FontAwesomeIcon className="tw-text-gray-600 music-icon tw-m-auto tw-text-2xl" icon={faMusic} />
            <FontAwesomeIcon
              className="tw-text-gray-600 play-icon tw-m-auto tw-text-2xl tw-text-white"
              icon={this.getActiveIcon(sound)}
              spin={sound.status === 'loading'}
            />
          </div>
          <div className="tw-text-left">
            <div className="tw-leading-none">
              <span className="tw-ml-2 tw-pt-1 tw-font-medium tw-text-sm">{sound.name}</span>
            </div>
            <div>
              <span className="tw-ml-2 tw-pt-1 tw-text-sm tw-text-gray-600">{formatBytes(sound.size)}</span>
              <span className="tw-ml-2 tw-pt-1 tw-text-sm tw-text-gray-600">{sound.buffer && formatDuration(sound.buffer.duration)}</span>
              <span className="tw-ml-2 tw-pt-1 tw-text-sm tw-text-gray-600">{sound.status}</span>
            </div>
          </div>
        </button>
        {/* <div className="soundBreak" /> */}
        <button
          type="button"
          className={
            classNames('tw-rounded tw-my-1 tw-h-12 tw-flex music-control-button hover:tw-bg-gray-200 tw-w-full tw-flex tw-items-center', {
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
          <div className="tw-text-left">
            <div className="tw-leading-none">
              <span className="tw-ml-2 tw-pt-1 tw-font-medium tw-text-sm">{t(isBackground ? 'isBackground' : 'setToBackground')}</span>
            </div>
            <div>
              {/* <span className="ml-2 pt-1 text-sm text-gray-600">{formatBytes(sound.size)}</span> */}
              <span className="tw-ml-2 tw-pt-1 tw-text-sm tw-text-gray-600" />
            </div>
          </div>
        </button>
        <button
          type="button"
          className={
            classNames('tw-rounded tw-my-1 tw-h-12 tw-flex music-control-button hover:tw-bg-gray-200 tw-w-full tw-flex tw-items-center', {
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
          <div className="tw-text-left">
            <div className="tw-leading-none">
              <span className="tw-ml-2 tw-pt-1 tw-font-medium tw-text-sm">{t(isInRotation ? 'inRotation' : 'addToRotation')}</span>
            </div>
            <div>
              {/* <span className="ml-2 pt-1 text-sm text-gray-600">{formatBytes(sound.size)}</span> */}
              <span className="tw-ml-2 tw-pt-1 tw-text-sm tw-text-gray-600">
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
