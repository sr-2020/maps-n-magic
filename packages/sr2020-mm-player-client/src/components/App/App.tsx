import React, { Component, useState, useEffect, PropsWithChildren } from 'react';

import './App.css';

import DocumentTitle from 'react-document-title';

import { ErrorBoundry } from "../ErrorBoundry";
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';

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
    audioContextWrapper,
    soundStorage
  } = props;
  const manageTitle = useState<string>('SR 2020 магия');
  const [title, setTitle] = manageTitle;

  const soundStageState = locationData2SoundStageState(locationData);

  return (
    <DocumentTitle title={title}>
      <BrowserRouter>
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
            <Route path="/qrTest">
              <QrTest />
            </Route>
            <Route path="/">
              {/* <Redirect to="/spirits" /> */}
              <Redirect to="/suitSpirit" />
            </Route>
          </Switch>

          <SoundStage 
            soundSettings={SOUND_SETTINGS}
            soundStageState={soundStageState} 
            audioContextWrapper={audioContextWrapper} 
            soundStorage={soundStorage}
          />
        </div>
      </BrowserRouter>
    </DocumentTitle>
  );
}


