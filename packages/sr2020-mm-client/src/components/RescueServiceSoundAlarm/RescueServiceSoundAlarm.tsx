import React, { useRef, useEffect, useState } from 'react';
import './RescueServiceSoundAlarm.css';
import * as R from 'ramda';

// const audio = null;
let audioPromise = null;
let audioPromiseResolved = false;

function playSound(gameModel) {
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
      gameModel.execute({
        type: 'postNotification',
        title: 'Запрещено воспроизведение звука',
        message: 'Действие 1. Попробуйте закрыть это сообщение (серьезно, это не шутка).',
        kind: 'error',
      });
    });
  }
}

export function RescueServiceSoundAlarm(props) {
  const { characterIdHealthList, gameModel } = props;
  // const [list, setList] = useState([]);
  const prevList = usePrevious(characterIdHealthList);
  if (R.difference(characterIdHealthList, prevList).length > 0) {
    playSound(gameModel);
  }
  // console.log(characterIdHealthList);
  //

  return null;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current || [];
}
