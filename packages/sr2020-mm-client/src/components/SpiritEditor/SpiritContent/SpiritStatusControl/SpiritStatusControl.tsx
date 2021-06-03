import React from 'react';
import './SpiritStatusControl.css';

import Button from 'react-bootstrap/Button';
import { 
  SpiritState,
  SpiritStatus
} from "sr2020-mm-event-engine";
import { WithTranslation } from "react-i18next";

interface SpiritStatusControlProps extends WithTranslation {
  state: SpiritState;
  changeSpiritStatus: (status: keyof typeof SpiritStatus) => void;
}

export function SpiritStatusControl(props: SpiritStatusControlProps) {
  const { t, state, changeSpiritStatus } = props;

  return (
    <div className="SpiritStatusControl">
      <span className="tw-pr-4">{t(state.status)}</span>
      {state.status === SpiritStatus.NotInGame && 
        <Button variant="outline-secondary" onClick={() => changeSpiritStatus("RestInAstral")}>
          {t('moveSpiritToGame')}
        </Button>
      }
      {state.status === SpiritStatus.RestInAstral && 
        <Button variant="outline-secondary" onClick={() => changeSpiritStatus("NotInGame")}>
          {t('takeSpiritFromGame')}
        </Button>
      }
    </div>
  );
}



