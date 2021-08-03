import React from 'react';
import './SoundStageGuard.css';
import { WithSoundSettings, WithSoundStageState } from '../../dataHOCs';

import { SoundStage } from '../SoundStage/SoundStage';
import { AudioContextWrapper, SoundStorage } from 'sr2020-mm-client-event-engine';

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



