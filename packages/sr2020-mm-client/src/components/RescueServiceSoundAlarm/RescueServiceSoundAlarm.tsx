import React, { useRef, useEffect, useState } from 'react';
import './RescueServiceSoundAlarm.css';
import * as R from 'ramda';
import { WithTranslation } from 'react-i18next';

import { GameModel, EPostNotification } from "sr2020-mm-event-engine";

import { WithCharacterIdHealthListForAudio } from '../../dataHOCs';

// const audio = null;
let audioPromise: Promise<HTMLAudioElement> | null = null;
let audioPromiseResolved: boolean = false;

function playSound(gameModel: GameModel, t: WithTranslation["t"]) {
  if (!audioPromise) {
    audioPromise = new Promise((resolve, reject) => {
      // audio = new Audio('http://localhost:3000/sounds/274682__jppi-stu__sw-school-pa-alert.wav');
      const audio = new Audio('/sounds/274682__jppi-stu__sw-school-pa-alert.wav');
      audio.addEventListener('loadeddata', () => {
        if (audio.readyState >= 2) {
          audioPromiseResolved = true;
          resolve(audio);
          // obj.play();
        }
      });
    });
  }
  if (audioPromiseResolved) {
    audioPromise.then((audio) => audio.play()).catch((err) => {
      console.error('Some conditions are not meets', err);
      gameModel.emit2<EPostNotification>({
        type: 'postNotification',
        title: t('soundProhibitedTitle'),
        message: t('soundProhibitedMessage'),
        kind: 'error',
      });
    });
  }
}

interface RescueServiceSoundAlarmProps extends WithCharacterIdHealthListForAudio, WithTranslation {
  gameModel: GameModel;
}

export function RescueServiceSoundAlarm(props: RescueServiceSoundAlarmProps): null {
  const { characterIdHealthList, gameModel, t } = props;
  // const [list, setList] = useState([]);
  const prevList = usePrevious(characterIdHealthList);
  if (R.difference(characterIdHealthList, prevList).length > 0) {
    playSound(gameModel, t);
  }
  // console.log(characterIdHealthList);
  //

  return null;
}

function usePrevious(value: number[]): number[] {
  const ref = useRef<number[]>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current || [];
}
