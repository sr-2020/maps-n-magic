import React, { useState } from 'react';
import './SoundResumer.css';

import Button from 'react-bootstrap/Button';
import { WithTranslation } from "react-i18next";

interface SoundResumerProps extends WithTranslation {
  audioContext: AudioContext;
}

export function SoundResumer(props: SoundResumerProps) {
  const { t, audioContext} = props;

  const [visible, setVisible] = useState<boolean>(audioContext.state === 'suspended');

  function onClick() {
    audioContext.resume();
    setVisible(false);
  }

  if (visible) {
    return (
      <Button onClick={onClick}>Нажмите для включения звука</Button>
    );
  }

  return null;
}



