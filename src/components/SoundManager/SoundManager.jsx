// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import './SoundManager.css';

// import { SoundHolder } from '../../utils/SoundHolder';
import { SoundManagerPropTypes } from '../../types';
import { SoundStageEcho } from './SoundStageEcho';

import { SoundRow } from './SoundRow';

export class SoundManager extends Component {
  static propTypes = SoundManagerPropTypes;

  constructor(props) {
    super(props);
    console.log('SoundManager constructing');
    this.state = {
      sounds: [],
      // soundStage: [],
      selectedSoundName: null,
    };
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
    this.onSoundStatusChange = this.onSoundStatusChange.bind(this);
    // this.getActiveIcon = this.getActiveIcon.bind(this);
    this.selectBackgroundSound = this.selectBackgroundSound.bind(this);
    this.selectRotationSound = this.selectRotationSound.bind(this);
  }

  componentDidMount = () => {
    const { soundService } = this.props;
    const sounds = soundService.getSounds();
    // this.soundHolder = new SoundHolder(soundService);
    this.setState({
      sounds,
      initialized: true,
    });
    console.log('SoundManager mounted');
    this.subscribe(this.props.soundService);
  }

  componentDidUpdate = (prevProps) => {
    console.log('SoundManager did update');
    if (prevProps.soundService === this.props.soundService) {
      return;
    }
    this.onUpdate(prevProps);
  }

  onUpdate(prevProps) {
    this.unsubscribe(prevProps.soundService);
    // this.soundHolder.dispose();

    const { soundService } = this.props;
    const sounds = soundService.getSounds();
    // this.soundHolder = new SoundHolder(soundService);
    this.setState({
      sounds,
      selectedSoundName: null,
    });
    this.subscribe(soundService);
  }

  componentWillUnmount = () => {
    console.log('SoundManager will unmount');
    this.unsubscribe(this.props.soundService);
    // this.soundHolder.dispose();
  }

  onSoundUpdate() {
    const { soundService } = this.props;
    const sounds = soundService.getSounds();
    this.setState({
      sounds,
    });
  }

  onSoundStatusChange({ name, status }) {
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

  // getActiveIcon(sound) {
  //   if (sound.status === 'loading') {
  //     return faSpinner;
  //   }
  //   const { soundService } = this.props;
  //   const isPlayingSound = soundService.isPlayingSound(sound.name);
  //   return isPlayingSound ? faStopCircle : faPlayCircle;
  // }

  subscribe(soundService) {
    soundService.on('soundsUpdate', this.onSoundUpdate);
    soundService.on('soundStatusChange', this.onSoundStatusChange);
  }

  unsubscribe(soundService) {
    soundService.off('soundsUpdate', this.onSoundUpdate);
    soundService.off('soundStatusChange', this.onSoundStatusChange);
  }

  selectBackgroundSound(soundName) {
    // this.soundHolder.onSelectSound(soundName);
    // this.setState({
    //   selectedSoundName: soundName,
    // });
    const { gameModel } = this.props;
    const soundStage = gameModel.get('soundStage');
    gameModel.execute({
      type: 'setBackgroundSound',
      name: soundStage.backgroundSound === soundName ? null : soundName,
    });
  }

  selectRotationSound(soundName) {
    // this.soundHolder.onSelectSound(soundName);
    // this.setState({
    //   selectedSoundName: soundName,
    // });
    const { gameModel } = this.props;
    const soundStage = gameModel.get('soundStage');

    const isInRotation = soundStage.rotationSounds.includes(soundName);
    gameModel.execute({
      type: 'rotationSoundsChange',
      added: isInRotation ? [] : [soundName],
      removed: isInRotation ? [soundName] : [],
      // name: soundStage.backgroundSound === soundName ? null : soundName,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { sounds, selectedSoundName, initialized } = this.state;

    if (!initialized) {
      return null;
    }

    let selectedSound = null;
    if (selectedSoundName) {
      selectedSound = sounds.find((sound) => sound.name === selectedSoundName);
    }

    const { gameModel } = this.props;

    return (
      <div className="SoundManager">
        <div className="px-3">
          {
            sounds.map((sound) => (
              <SoundRow
                key={sound.name}
                sound={sound}
                isSelected={selectedSoundName === sound.name}
                selectBackgroundSound={this.selectBackgroundSound}
                selectRotationSound={this.selectRotationSound}
              />
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
        <SoundStageEcho gameModel={gameModel} />
      </div>
    );
  }
}
