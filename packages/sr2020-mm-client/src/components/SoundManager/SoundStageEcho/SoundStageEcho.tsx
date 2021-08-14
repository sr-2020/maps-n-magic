import React, { Component, useEffect } from 'react';
import './SoundStageEcho.css';
import { useTranslation } from 'react-i18next';
import { GameModel, SoundStageData, Rotation } from "sr2020-mm-event-engine";
import { WithSoundSettings, WithSoundStageState } from '../../../dataHOCs';
import { SetBackgroundSound, SetRotationSounds } from 'sr2020-mm-client-event-engine';

interface SoundStageEchoProps extends WithSoundSettings, WithSoundStageState {
  gameModel: GameModel;
};

export function SoundStageEcho(props: SoundStageEchoProps) {
  const { soundSettings, soundStageState, gameModel } = props;
  const { t } = useTranslation();

  useEffect(() => {
    let bgCounter = 0;
    let spiritCounter = 0;
    let spiritCounter2 = 0;

    const spiritList = [
      // { key: 'spirit1', name: 'spirit_barguzin_2.mp3', volumePercent: 10 },
      { key: 'spirit2', name: 'spirit_barguzin_2.mp3', volumePercent: 50 },
      // { key: 'spirit3', name: 'spirit_barguzin_2.mp3', volumePercent: 90 },
      { key: 'spirit4', name: 'spirit_kultuk_3.mp3', volumePercent: 50 },
      { key: 'spirit5', name: 'spirit_sarma_4.mp3', volumePercent: 50 },
    ];

    const rotation1: Rotation = {
      key: 1,
      tracks: [
        { key: 'spirit4', name: 'spirit_kultuk_3.mp3', volumePercent: 50 },
        { key: 'spirit5', name: 'spirit_sarma_4.mp3', volumePercent: 50 },
      ]
    };

    const rotation2: Rotation = {
      key: 2,
      tracks: [
        { key: 'spirit1', name: 'spirit_barguzin_2.mp3', volumePercent: 10 },
        { key: 'spirit2', name: 'spirit_barguzin_2.mp3', volumePercent: 50 },
        { key: 'spirit3', name: 'spirit_barguzin_2.mp3', volumePercent: 90 },
      ]
    };

    const intervalId = setInterval(() => {

      const name =  'manaLevel_' + (bgCounter%7 + 1) + '.mp3';
      gameModel.execute2<SetBackgroundSound>({
        type: 'setBackgroundSound',
        trackData: {
          key: name,
          // name: 'manaLevel_' + (Math.floor(Date.now() / 1000)%7 + 1) + '.mp3',
          // name: 'manaLevel_' + (Math.floor(Date.now() / 1000)%7 + 1) + '.mp3',
          name,
          volumePercent: 50
        }
      });
      bgCounter++;

      // gameModel.execute2<SetRotationSounds>({
      //   type: 'setRotationSounds',
      //   rotation: {
      //     key: 1,
      //     tracks: [
      //       spiritList[spiritCounter%spiritList.length]
      //     ]
      //   }
      // });
      
      // spiritCounter++;

      gameModel.execute2<SetRotationSounds>({
        type: 'setRotationSounds',
        rotation: spiritCounter2%2 === 1 ? rotation1 : rotation2
      });
      
      spiritCounter2++;


    // // }, 1000);
    // }, 601); // 601 is a prime number
    // }, 3400); // 601 is a prime number
    }, 15000); // 601 is a prime number
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (soundSettings === null || soundStageState === null) {
    return (
      <div className="SoundStageEcho">
        {t('loadingSoundData')}
      </div>
    );
  }

  const { backgroundSound, rotationSounds } = soundStageState;

  return (
    <div className="SoundStageEcho tw-absolute tw-bottom-0 tw-bg-white tw-opacity-70">
      {/* SoundStageEcho body */}
      <div>
        <div>background sound</div>
        <div className="tw-ml-8">{JSON.stringify(backgroundSound)}</div>
      </div>
      <div>
        <div>rotation sounds</div>
        {
          rotationSounds !== null && 
          <div className="tw-ml-8">
            <div>{JSON.stringify({key: rotationSounds.key, length: rotationSounds.tracks.length})}</div>
            <ul>{rotationSounds.tracks.map((sound) => <li key={sound.key}>{sound.key + ' ' + sound.name}</li>)}</ul>
          </div>
        }
      </div>
      <div>
        <div>soundSettings</div>
        <div className="tw-ml-8">{JSON.stringify(soundSettings)}</div>
      </div>
    </div>
  );
}
