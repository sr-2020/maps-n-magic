import React, { useRef, useEffect, useState } from 'react';
import './RescueServiceSoundAlarm.css';
import * as R from 'ramda';

let audio = null;

function playSound() {
  if (!audio) {
    // audio = new Audio('http://localhost:3000/sounds/274682__jppi-stu__sw-school-pa-alert.wav');
    audio = new Audio('/sounds/274682__jppi-stu__sw-school-pa-alert.wav');
  }
  audio.play();
}

export function RescueServiceSoundAlarm(props) {
  const { characterIdHealthList } = props;
  // const [list, setList] = useState([]);
  const prevList = usePrevious(characterIdHealthList);
  if (R.difference(characterIdHealthList, prevList).length > 0) {
    playSound();
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
