import React, { Component, useEffect } from 'react';
import './SoundStageEcho.css';
import { GameModel, SoundStageData } from "sr2020-mm-event-engine";
import { WithSoundSettings, WithSoundStageState } from '../../../dataHOCs';
import { SetBackgroundSound } from 'sr2020-mm-client-event-engine';

interface SoundStageEchoProps extends WithSoundSettings, WithSoundStageState {
  gameModel: GameModel;
};

export function SoundStageEcho(props: SoundStageEchoProps) {
  const { soundSettings, soundStageState, gameModel } = props;

  useEffect(() => {
    const intervalId = setInterval(() => {
      gameModel.execute2<SetBackgroundSound>({
        type: 'setBackgroundSound',
        trackData: {
          name: 'manaLevel_' + (Math.floor(Date.now() / 1000)%7 + 1),
          volumePercent: 50
        }
      });
    })
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (soundSettings === null || soundStageState === null) {
    return (
      <div className="SoundStageEcho">
        Загрузка звуковых данных...
      </div>
    );
  }

  const { backgroundSound, rotationSounds } = soundStageState;

  return (
    <div className="SoundStageEcho">
      {/* SoundStageEcho body */}
      <div>
        <div>background sound</div>
        <div>{backgroundSound}</div>
      </div>
      <div>
        <div>rotation sounds</div>
        <ul>
          {
            rotationSounds.map((sound) => <li key={sound.name}>{sound.name}</li>)
          }
        </ul>
      </div>
      <div>
        {JSON.stringify(soundSettings)}
      </div>
    </div>
  );
}
