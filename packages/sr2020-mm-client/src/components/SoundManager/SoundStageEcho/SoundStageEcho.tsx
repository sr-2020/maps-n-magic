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
    let counter = 0;
    const intervalId = setInterval(() => {
      gameModel.execute2<SetBackgroundSound>({
        type: 'setBackgroundSound',
        trackData: {
          // name: 'manaLevel_' + (Math.floor(Date.now() / 1000)%7 + 1) + '.mp3',
          // name: 'manaLevel_' + (Math.floor(Date.now() / 1000)%7 + 1) + '.mp3',
          name: 'manaLevel_' + (counter%7 + 1) + '.mp3',
          volumePercent: 50
        }
      });
      counter++;
    // }, 1000);
    // }, 601); // 601 is a prime number
    }, 3400); // 601 is a prime number
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
    <div className="SoundStageEcho tw-absolute tw-bottom-0 tw-bg-white tw-opacity-70">
      {/* SoundStageEcho body */}
      <div>
        <div>background sound</div>
        <div>{JSON.stringify(backgroundSound)}</div>
      </div>
      <div>
        <div>rotation sounds</div>
        {
          rotationSounds !== null && 
          <div>
            <div>{rotationSounds.key}</div>
            <ul>{rotationSounds.tracks.map((sound) => <li key={sound.name}>{sound.name}</li>)}</ul>
          </div>
        }
      </div>
      <div>
        <div>soundSettings</div>
        <div>{JSON.stringify(soundSettings)}</div>
      </div>
    </div>
  );
}
