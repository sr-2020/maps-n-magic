import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import { App } from './components/App';
import { AuthWrapper } from './components/AuthWrapper';
import { Emercom } from './components/Emercom';
import { 
  ErrorBoundry,
} from 'sr2020-mm-client-core';
import { LoginManager } from './utils';

const loginManager = new LoginManager();
// import reportWebVitals from './reportWebVitals';


function StateRouter(props: {loginManager: LoginManager}) {
  const { loginManager: { loginState } } = props;
  if (loginState.status === 'userLogged' && loginState.tokenData.auth.includes('ROLE_EMERCOM')) {
    return <Emercom loginManager={loginManager} />;
  }
  return <App loginManager={loginManager} />;
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundry>
      <AuthWrapper loginManager={loginManager}>
        <StateRouter loginManager={loginManager} />
      </AuthWrapper>
    </ErrorBoundry>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
