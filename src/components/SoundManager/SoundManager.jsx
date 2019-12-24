// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import './SoundManager.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlayCircle, faPause, faMusic, faStopCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { formatBytes } from '../../utils/miscUtils';
import { SoundHolder } from '../../utils/SoundHolder';
// import { SoundManagerPropTypes } from '../../types';

export class SoundManager extends Component {
  // static propTypes = SoundManagerPropTypes;

  constructor(props) {
    super(props);
    const sounds = props.soundService.getSounds();
    this.soundHolder = new SoundHolder(props.soundService);
    this.state = {
      sounds,
      selectedSoundName: null,
    };
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
    this.onSoundStatusChange = this.onSoundStatusChange.bind(this);
    this.getActiveIcon = this.getActiveIcon.bind(this);
  }

  componentDidMount = () => {
    console.log('SoundManager mounted');
    this.props.soundService.on('soundsUpdate', this.onSoundUpdate);
    this.props.soundService.on('soundStatusChange', this.onSoundStatusChange);
  }

  onSoundUpdate() {
    const sounds = this.props.soundService.getSounds();
    this.setState({
      sounds,
    });
  }

  onSoundStatusChange({ name, status }) {
    // const { selectedSoundName } = this.state;
    // this.soundHolder.onSoundStatusChange({ name, status });
    // if (name === selectedSoundName && this.props.soundService.canPlaySound(name)) {
    //   this.props.soundService.playSound(name, true);
    // }

    this.setState((state) => ({
      sounds: state.sounds.map((sound) => {
        if (sound.name !== name) {
          return sound;
        }
        return {
          ...sound,
          status,
        };
      }),
    }));
  }

  componentDidUpdate = () => {
    console.log('SoundManager did update');
  }

  componentWillUnmount = () => {
    console.log('SoundManager will unmount');
  }

  getActiveIcon(sound) {
    if (sound.status === 'loading') {
      return faSpinner;
    }
    const { soundService } = this.props;
    const isPlayingSound = soundService.isPlayingSound(sound.name);
    return isPlayingSound ? faStopCircle : faPlayCircle;
  }

  selectSound(soundName) {
    this.soundHolder.onSelectSound(soundName);
    this.setState({
      selectedSoundName: soundName,
    });
    // console.log('selectSound');
    // const { soundService } = this.props;
    // const sound = soundService.getSound(soundName);
    // const canPlay = soundService.canPlaySound(soundName);
    // const isPlayingSound = soundService.isPlayingSound(soundName);
    // this.setState((state) => {
    //   const { selectedSoundName } = state;
    //   if (selectedSoundName === soundName) { // play or stop some sound
    //   } else { // stop existing sound and play other sound
    //     soundService.playSound(selectedSoundName, false);
    //   }
    //   if (canPlay) {
    //     soundService.playSound(soundName, !isPlayingSound);
    //   } else {
    //     soundService.loadSound(soundName);
    //   }
    //   return {
    //     selectedSoundName: soundName,
    //   };
    // });
  }


  // eslint-disable-next-line max-lines-per-function
  render() {
    const { sounds, selectedSoundName } = this.state;
    let selectedSound = null;
    if (selectedSoundName) {
      selectedSound = sounds.find((sound) => sound.name === selectedSoundName);
    }

    // const { t } = this.props;

    // if (!something) {
    //   return <div> SoundManager stub </div>;
    //   // return null;
    // }
    // class
    return (
      <div className="SoundManager">
        <div className="px-3">
          {
            sounds.map((sound) => (
              <button
                type="button"
                key={sound.name}
                className={
                  classNames('rounded my-1 h-12 flex music-control-button hover:bg-gray-200 w-full flex items-center', {
                    selected: selectedSoundName === sound.name,
                  })
                }

                onClick={() => this.selectSound(sound.name)}
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
                    <span className="ml-2 pt-1 text-sm text-gray-600">{sound.status}</span>
                  </div>
                </div>
              </button>
            ))
          }
        </div>
        {/* {
          selectedSound && (
            <div>
              {selectedSound.name}
              {' '}
              {selectedSound.status}
            </div>
          )
        } */}
      </div>
    );
  }
}
