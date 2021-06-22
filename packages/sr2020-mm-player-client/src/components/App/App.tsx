import React, { Component, useState, useEffect, PropsWithChildren } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import DocumentTitle from 'react-document-title';

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

import { ErrorBoundry } from "../ErrorBoundry";
// import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LoginManager } from "../../utils";
import { LoginState } from "../../types";
import { WithLoginState } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { logoutUser, callSecureApi } from "../../api";

interface AppProps extends WithLoginState {
  loginManager: LoginManager;
}

const es = new EventSource('http://localhost:3002/singlePlayerDataSse');
es.addEventListener('message', function (e) {
  console.log(e);
});

export function App(props: AppProps) {
  const { loginState, loginManager } = props;

  const onLogout = async () => {
    // event.preventDefault();
    await logoutUser();
    loginManager.updateLoginState();
  }
  
  return (
    <DocumentTitle title="Приложение">
      {/* <MapDefaultsProvider value={mapDefaults}> */}
        <div className="App">
          <Button 
            onClick={callSecureApi}
          >
            Запрос на защищенный эндпоинт
          </Button>

          <h1>Application</h1>
          {loginState.status}
          <Button 
            onClick={onLogout}
          >
            Выйти
          </Button>
          {/* <BrowserRouter>
            <Switch>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/preferences">
                <Preferences />
              </Route>
            </Switch>
          </BrowserRouter> */}
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header> */}
        </div>
      {/* </MapDefaultsProvider> */}
    </DocumentTitle>
  );
}


