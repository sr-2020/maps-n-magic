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

interface SoundStageProps {
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
  soundStageState: SoundStageState;
  soundSettings: SoundSettings;
}



export class SoundStage extends React.Component<SoundStageProps> {
  soundStageState: SoundStageState = {
    backgroundSound: null,
    rotationSounds: []
  };

  backgroundChannel: BackgroundChannel;

  rotationChannel: RotationChannel;

  constructor(props: SoundStageProps) {
    super(props);
    this.rotationChannel = new RotationChannel(this);
    this.backgroundChannel = new BackgroundChannel(this);
  }

  componentDidMount() {
    const { soundStageState, soundStorage, soundSettings } = this.props;
    this.soundStageState = R.clone(soundStageState);
    // this.soundStageState.backgroundSound = 'spirit_sarma_4.mp3';
    this.soundStageState.backgroundSound = 'manaLevel_3.mp3';
    this.soundStageState.rotationSounds = [
      'spirit_barguzin_2.mp3',
      'spirit_kultuk_3.mp3',
      'spirit_sarma_4.mp3',
    ];
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

  componentWillUnmount() {
    this.rotationChannel.dispose();
    this.backgroundChannel.dispose();
  }
  
  render () {
    return null;
    // const { soundSettings, soundStageState, audioContextWrapper, soundStorage } = this.props;
  
    // return (
    //   <div className="SoundStage">
    //     SoundStage content
    //   </div>
    // );
  }
}




