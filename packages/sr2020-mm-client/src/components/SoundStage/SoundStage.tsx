import React from 'react';
import './SoundStage.css';
import * as R from 'ramda';

import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SoundStorage } from '../../utils';
import { shuffle, SoundSettings, SoundStageState } from 'sr2020-mm-event-engine';

import { Sound, SoundCtl } from "../../types";
import { PlaylistItem, SoundChannel } from './types';
import { ctlStart, ctlStop } from './utils';
import { RotationChannel } from './RotationChannel';
import { BackgroundChannel } from './BackgroundChannel';
import { SoundResumer } from '../SoundResumer';

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
    // this.soundStageState.backgroundSound = 'spirit_sarma_4.mp3';
    // this.soundStageState.backgroundSound = {
    //   key: 'manaLevel_3.mp3',
    //   name: 'manaLevel_3.mp3',
    //   volumePercent: 50
    //   // volumePercent: 5
    // };

    // this.soundStageState.rotationSounds = {
    //   key: 1,
    //   tracks: [
    //     { key: 'spirit1', name: 'spirit_barguzin_2.mp3', volumePercent: 10 },
    //     { key: 'spirit2', name: 'spirit_barguzin_2.mp3', volumePercent: 50 },
    //     { key: 'spirit3', name: 'spirit_barguzin_2.mp3', volumePercent: 90 },
    //     // { name: 'spirit_kultuk_3.mp3', volumePercent: 50 },
    //     // { name: 'spirit_sarma_4.mp3', volumePercent: 50 },
    //   ]
    // };


    this.rotationChannel.run();
    this.backgroundChannel.run();
    // setInterval(() => {
    //   if (this.soundStageState.backgroundSound) {
    //     this.soundStageState.backgroundSound = null;
    //   } else {
    //     this.soundStageState.backgroundSound = 'spirit_sarma_4.mp3';
    //   }
    // }, 1200);
    // this.soundStageState.backgroundSound = 'manaLevel_4.mp3';
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
        <SoundResumer 
          audioContext={audioContextWrapper.context}
        />
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
    // if

    return null;
    // const { soundSettings, soundStageState, audioContextWrapper, soundStorage } = this.props;
  
    // return (
    //   <div className="SoundStage">
    //     SoundStage content
    //   </div>
    // );
  }
}




