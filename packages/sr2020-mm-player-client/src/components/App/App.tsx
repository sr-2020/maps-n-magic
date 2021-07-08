import React, { Component, useState, useEffect, PropsWithChildren } from 'react';

import './App.css';

import DocumentTitle from 'react-document-title';

import { ErrorBoundry } from "../ErrorBoundry";
import { HashRouter as Router, Route, Switch, Redirect, NavLink } from 'react-router-dom';

import { locationData2SoundStageState, LoginManager } from "../../utils";
import { LoginState } from "../../types";
import { WithLoginState, WithAggregatedLocationData } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { SpiritList } from "../SpiritList";
import { QrTest } from "../QrTest";
import { SpiritPage } from "../SpiritPage";
import { SuitSpiritPage } from "../SuitSpiritPage";
import { AudioContextWrapper, SoundStorage } from 'sr2020-mm-client-event-engine';
import { AppHeader } from '../AppHeader';
import { SoundStage } from '../SoundStage';
import { SoundSettings, SoundStageState } from 'sr2020-mm-event-engine';
import { CatchSpiritPage } from '../CatchSpiritPage';
import { CharacterPage } from '../CharacterPage';

interface AppProps extends WithLoginState, WithAggregatedLocationData {
  loginManager: LoginManager;
  audioContextWrapper: AudioContextWrapper;
  soundStorage: SoundStorage;
}

const SOUND_SETTINGS: SoundSettings = {
  rotationTimeout: 2000,
  rotationSoundTimeout: 5000,
  backgroundVolume: 50,
  rotationVolume: 50,
};


export function App(props: AppProps) {
  const { 
    loginState, 
    loginManager, 
    locationData,
    characterData,
    audioContextWrapper,
    soundStorage
  } = props;
  const manageTitle = useState<string>('SR 2020 магия');
  const [title, setTitle] = manageTitle;

  const soundStageState = locationData2SoundStageState(locationData);

  return (
    <DocumentTitle title={title}>
      <Router>
        <div className="App">
          <AppHeader
            title={title}
            loginManager={loginManager}
            locationData={locationData}
          />

        {/* {JSON.stringify(locationData)} */}
        
          <Switch>
            <Route path="/spirits">
              <SpiritList 
                setTitle={setTitle}
                locationData={locationData}
              />
            </Route>
            <Route path="/scanSpirit">
              <SpiritPage />
            </Route>
            <Route path="/suitSpirit">
              <SuitSpiritPage />
            </Route>
            {/* <Route path="/qrTest">
              <QrTest />
            </Route> */}
            <Route path="/character">
              <CharacterPage 
                characterData={characterData}
              />
            </Route>
            <Route
              path="/catchSpirit/:id"
              render={({ match }) => {
                const { id } = match.params;

                return (
                  <CatchSpiritPage
                    id={Number(id)}
                    key={Number(id)}
                  />
                );
              }}
            />
            <Route path="/">
              {/* <Redirect to="/spirits" /> */}
              <Redirect to="/suitSpirit" />
              {/* <Redirect to="/character" /> */}
            </Route>
          </Switch>

          <SoundStage 
            soundSettings={SOUND_SETTINGS}
            soundStageState={soundStageState} 
            audioContextWrapper={audioContextWrapper} 
            soundStorage={soundStorage}
          />
        </div>
      </Router>
    </DocumentTitle>
  );
}


