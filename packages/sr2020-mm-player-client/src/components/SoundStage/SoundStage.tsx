import React from 'react';
import './SoundStage.css';
import * as R from 'ramda';

import { SoundSettings, SoundStageState } from 'sr2020-mm-event-engine';

import { 
  AudioContextWrapper, 
  BackgroundChannel, 
  RotationChannel, 
  SoundStorage 
} from 'sr2020-mm-client-event-engine';

interface SoundStageProps {
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
  soundStageState: SoundStageState;
  soundSettings: SoundSettings;
}

interface ComponentSoundStageState {
  bgSoundInfo: string;
  rotationSoundInfo: string;
}

(window as any).DEBUG_SOUND_STAGE = false;
// (window as any).DEBUG_SOUND_STAGE = true;

export class SoundStage extends React.Component<SoundStageProps, ComponentSoundStageState> {
  soundStageState: SoundStageState = {
    backgroundSound: null,
    rotationSounds: null
  };

  backgroundChannel: BackgroundChannel;

  rotationChannel: RotationChannel;

  constructor(props: SoundStageProps) {
    super(props);
    this.state = {
      bgSoundInfo: '',
      rotationSoundInfo: ''
    };
    this.rotationChannel = new RotationChannel(this);
    this.backgroundChannel = new BackgroundChannel(this);
  }


  componentDidMount() {
    const { soundStageState, soundStorage, soundSettings } = this.props;
    this.soundStageState = R.clone(soundStageState);
    this.rotationChannel.run();
    this.backgroundChannel.run();
  }

  componentDidUpdate(prevProps: SoundStageProps) {
    const { soundStageState } = this.props;
    if (!R.equals(soundStageState, prevProps.soundStageState)) {
      this.soundStageState = R.clone(soundStageState);
      if (soundStageState.rotationSounds?.key !== prevProps.soundStageState.rotationSounds?.key) {
        this.rotationChannel.smoothEndRotation();
      }
    }
  }

  componentWillUnmount() {
    this.rotationChannel.dispose();
    this.backgroundChannel.dispose();
  }

  setCurBgSoundData(data: string) {
    this.setState({bgSoundInfo: data});
  }

  setCurRotationSoundData(data: string) {
    this.setState({rotationSoundInfo: data});
  }
  
  render () {
    const { bgSoundInfo, rotationSoundInfo } = this.state;
    const { audioContextWrapper } = this.props;

    return (
      <div className="SoundStage tw-absolute tw-bottom-0 tw-right-0 tw-bg-white tw-opacity-70">
        {
          (window as any).DEBUG_SOUND_STAGE && (
            <>
              <div>
                <div>curBgSound</div>
                <pre>{bgSoundInfo}</pre>
              </div>
              <div>
                <div>curRotationSound</div>
                <pre>{rotationSoundInfo}</pre>
              </div>
            </>
          )
        }
      </div>
    );
  }
}




