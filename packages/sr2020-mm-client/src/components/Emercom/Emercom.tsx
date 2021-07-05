import React from 'react';
import './Emercom.css';

import { WithTranslation } from "react-i18next";
import { makeGameModel } from 'sr2020-mm-client-event-engine';
import { RescueServiceMap } from '../../maps/RescueServiceMap';
import { logoutUser } from '../../api';
import { LoginManager } from '../../utils';
import Button from 'react-bootstrap/Button';
import { GameModel, SetEnableManaOcean, GetEnableManaOcean } from 'sr2020-mm-event-engine';
import { mapDefaults } from '../../configs';
import DocumentTitle from 'react-document-title';
import { MapDefaultsProvider } from 'sr2020-mm-client-core';

interface EmercomProps extends WithTranslation {
  loginManager: LoginManager;
}

interface EmercomState {
  gameModel: GameModel | null;
};

export class Emercom extends React.Component<EmercomProps, EmercomState> {
  audioContext = new AudioContext();

  constructor(props: EmercomProps) {
    super(props);
    this.state = {
      gameModel: null
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { gameModel, gameServer } = makeGameModel(true);
    this.setState({
      gameModel
    });
  }

  onClick() {
    this.audioContext.resume();
    this.setState({});
  }
  
  render() {
    if (this.audioContext.state === 'suspended') {
      return (
        <div className="tw-flex tw-flex-col tw-h-screen tw-justify-center">
          <Button className="tw-py-24 tw-mx-4" onClick={this.onClick}>Нажмите дважды для включения звука</Button>
        </div>
      ); 
    }

    const { loginManager } = this.props;
    const { gameModel } = this.state;

    if (gameModel === null) {
      return null;
    }
  
    const onLogout = async () => {
      // event.preventDefault();
      await logoutUser();
      loginManager.updateLoginState(true);
      // gameModel.execute2<SetEnableManaOcean>({
      //   type: 'setEnableManaOcean',
      //   enableManaOcean: !gameModel.get2<GetEnableManaOcean>('enableManaOcean'),
      // });
    }
  
    return (
      <DocumentTitle title="Карта МЧС">
        <MapDefaultsProvider value={mapDefaults}>
          <div className="Emercom tw-flex tw-flex-col tw-h-screen">
            <main className="tw-flex-auto tw-h-full">
              <RescueServiceMap
                gameModel={gameModel}
              />
            </main>
            <Button
              onClick={onLogout}
              title="Выйти"
              className="tw-py-3 tw-text-lg tw-fixed tw-top-0" 
              style={{'right': '5rem', 'zIndex': 1000}}
            >
              Выйти
            </Button>
          </div>
        </MapDefaultsProvider>
      </DocumentTitle>
    );
  }
}



