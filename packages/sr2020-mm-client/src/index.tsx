import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import { App } from './components/App';
import { AuthWrapper } from './components/AuthWrapper';
import { 
  ErrorBoundry,
} from 'sr2020-mm-client-core';
import { LoginManager } from './utils';

// import {
//   makeGameModel,
// } from 'sr2020-mm-client-event-engine';
// const t = makeGameModel();

const loginManager = new LoginManager();
// import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundry>
      <AuthWrapper loginManager={loginManager}>
        <App loginManager={loginManager} />
      </AuthWrapper>
    </ErrorBoundry>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
