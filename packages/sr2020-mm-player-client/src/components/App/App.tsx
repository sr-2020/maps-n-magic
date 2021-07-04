import React, { Component, useState, useEffect, PropsWithChildren } from 'react';

import './App.css';

import DocumentTitle from 'react-document-title';

import { ErrorBoundry } from "../ErrorBoundry";
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';

import { LoginManager } from "../../utils";
import { LoginState } from "../../types";
import { WithLoginState, WithAggregatedLocationData } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { SpiritList } from "../SpiritList";
import { QrTest } from "../QrTest";
import { SpiritPage } from "../SpiritPage";
import { SuitSpiritPage } from "../SuitSpiritPage";
import { AudioContextWrapper, SoundStorage } from 'sr2020-mm-client-event-engine';
import { AppHeader } from '../AppHeader';

interface AppProps extends WithLoginState, WithAggregatedLocationData {
  loginManager: LoginManager;
}

export function App(props: AppProps) {
  const { loginState, loginManager, locationData } = props;
  const manageTitle = useState<string>('SR 2020 магия');
  const [title, setTitle] = manageTitle;
  const [audioContextWrapper] = useState<AudioContextWrapper>(new AudioContextWrapper());
  const [soundStorage] = useState<SoundStorage>(new SoundStorage(audioContextWrapper));

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
        </div>
      </BrowserRouter>
    </DocumentTitle>
  );
}


