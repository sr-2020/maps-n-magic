// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import './SoundManager.css';

import { SoundManagerPropTypes } from '../../types';
import { SoundStageEcho } from './SoundStageEcho';

import { SoundSettingsForm } from './SoundSettingsForm';

import { SoundRow } from './SoundRow';

export class SoundManager extends Component {
  static propTypes = SoundManagerPropTypes;

  constructor(props) {
    super(props);
    console.log('SoundManager constructing');
    this.state = {
      sounds: [],
      soundStageState: {},
      playbackRotation: [],
      currentTimeout: null,
    };
    this.onSoundUpdate = this.onSoundUpdate.bind(this);
    this.onSoundStageUpdate = this.onSoundStageUpdate.bind(this);
    this.selectBackgroundSound = this.selectBackgroundSound.bind(this);
    this.selectRotationSound = this.selectRotationSound.bind(this);
    this.onPlaybackRotationUpdate = this.onPlaybackRotationUpdate.bind(this);
    this.onCurrentTimeoutUpdate = this.onCurrentTimeoutUpdate.bind(this);
  }

  componentDidMount = () => {
    this.onSoundUpdate();
    this.onSoundStageUpdate();
    this.onPlaybackRotationUpdate();
    this.setState({
      initialized: true,
    });
    console.log('SoundManager mounted');
    this.subscribe(this.props.gameModel);
    this.subscribeOnSoundStage(this.props.soundStage);
  }

  componentDidUpdate = (prevProps) => {
    console.log('SoundManager did update');
    if (prevProps.gameModel !== this.props.gameModel) {
      this.onGameModelUpdate(prevProps);
    }
  }

  onGameModelUpdate(prevProps) {
    this.unsubscribe(prevProps.gameModel);
    this.onSoundUpdate();
    this.onSoundStageUpdate();
    this.subscribe(this.props.gameModel);
  }

  componentWillUnmount = () => {
    console.log('SoundManager will unmount');
    this.unsubscribe(this.props.gameModel);
    this.unsubscribeFromSoundStage(this.props.soundStage);
  }

  onSoundUpdate() {
    const { gameModel } = this.props;
    const sounds = gameModel.get('sounds');
    this.setState({
      sounds,
    });
  }

  onSoundStageUpdate() {
    const { gameModel } = this.props;
    const soundStageState = gameModel.get('soundStage');
    this.setState({
      soundStageState,
    });
  }

  onPlaybackRotationUpdate() {
    const { soundStage } = this.props;
    this.setState({
      playbackRotation: soundStage.getPlaybackRotation(),
    });
  }

  onCurrentTimeoutUpdate({ currentTimeout }) {
    this.setState({
      currentTimeout,
    });
  }

  subscribeOnSoundStage(soundStage) {
    soundStage.on('playbackRotationUpdate', this.onPlaybackRotationUpdate);
    soundStage.on('currentTimeoutUpdate', this.onCurrentTimeoutUpdate);
  }

  unsubscribeFromSoundStage(soundStage) {
    soundStage.off('playbackRotationUpdate', this.onPlaybackRotationUpdate);
    soundStage.off('currentTimeoutUpdate', this.onCurrentTimeoutUpdate);
  }

  subscribe(gameModel) {
    gameModel.on('soundLoaded', this.onSoundUpdate);
    gameModel.on('soundsRemoved', this.onSoundUpdate);
    gameModel.on('rotationSoundsUpdate', this.onSoundStageUpdate);
    gameModel.on('backgroundSoundUpdate', this.onSoundStageUpdate);
  }

  unsubscribe(gameModel) {
    gameModel.off('soundLoaded', this.onSoundUpdate);
    gameModel.off('soundsRemoved', this.onSoundUpdate);
    gameModel.off('rotationSoundsUpdate', this.onSoundStageUpdate);
    gameModel.off('backgroundSoundUpdate', this.onSoundStageUpdate);
  }

  selectBackgroundSound(soundName) {
    const { gameModel } = this.props;
    const soundStageState = gameModel.get('soundStage');
    gameModel.execute({
      type: 'setBackgroundSound',
      name: soundStageState.backgroundSound === soundName ? null : soundName,
    });
  }

  selectRotationSound(soundName) {
    const { gameModel } = this.props;
    const soundStageState = gameModel.get('soundStage');

    const isInRotation = soundStageState.rotationSounds.includes(soundName);
    gameModel.execute({
      type: 'rotationSoundsChange',
      added: isInRotation ? [] : [soundName],
      removed: isInRotation ? [soundName] : [],
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      sounds, soundStageState, initialized, playbackRotation, currentTimeout,
    } = this.state;

    if (!initialized) {
      return null;
    }

    const { gameModel, t } = this.props;

    return (
      <div className="SoundManager">
        <SoundSettingsForm gameModel={gameModel} />
        <div className="px-3">
          {
            sounds.map((sound) => (
              <SoundRow
                key={sound.name}
                sound={sound}
                isSelected={false}
                isInRotation={soundStageState.rotationSounds.includes(sound.name)}
                isBackground={soundStageState.backgroundSound === sound.name}
                selectBackgroundSound={this.selectBackgroundSound}
                selectRotationSound={this.selectRotationSound}
                playbackIndex={playbackRotation.findIndex((el) => el === sound.name)}
              />
            ))
          }
        </div>

        {currentTimeout && (
          <div>
            {t('nextSoundIn', {
              timeout: `${(currentTimeout / 1000).toFixed(1)}s`,
            })}
          </div>
        )}
        {/* <SoundStageEcho gameModel={gameModel} /> */}
      </div>
    );
  }
}
