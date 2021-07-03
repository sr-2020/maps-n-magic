import React from 'react';
import './SoundStageGuard.css';
import { WithSoundSettings, WithSoundStageState } from '../../dataHOCs';

import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SoundStorage } from '../../utils';
import { SoundStage } from '../SoundStage/SoundStage';
import { GameModel } from 'sr2020-mm-event-engine';

interface SoundStageGuardProps extends WithSoundSettings, WithSoundStageState {
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
}

export function SoundStageGuard(props: SoundStageGuardProps) {
  const { 
    soundSettings, 
    soundStageState, 
    audioContextWrapper, 
    soundStorage 
  } = props;

  if (soundSettings === null || soundStageState === null) {
    return null;
  }

  return (
    <SoundStage 
      soundSettings={soundSettings}
      soundStageState={soundStageState} 
      audioContextWrapper={audioContextWrapper} 
      soundStorage={soundStorage}
    />
  );
}



