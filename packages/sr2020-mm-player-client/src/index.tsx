import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tailwind.css';
import './index.css';
// import './i18n';
// import { App } from './components/App';
import { App } from './components/App';
import { AuthWrapper } from "./components/AuthWrapper";
import { LoginManager } from './utils';
import { ErrorBoundry } from "./components/ErrorBoundry";
import { AudioContextWrapper, SoundStorage } from 'sr2020-mm-client-event-engine';

import Button from 'react-bootstrap/Button';
import DocumentTitle from 'react-document-title';

const loginManager = new LoginManager();
// import reportWebVitals from './reportWebVitals';

class AudioContainer extends React.Component {
  audioContextWrapper = new AudioContextWrapper();

  soundStorage = new SoundStorage(this.audioContextWrapper);

  render () {
    const onClick = () => {
      this.audioContextWrapper.context.resume();
      this.setState({});
    }

    if (this.audioContextWrapper.context.state === 'suspended') {
      return (
        <div className="tw-flex tw-flex-col tw-h-screen tw-justify-center">
          <Button className="tw-py-24 tw-mx-4" onClick={onClick}>Нажмите дважды для включения звука</Button>
        </div>
      ); 
    }

    return (
      <App 
        loginManager={loginManager} 
        audioContextWrapper={this.audioContextWrapper}
        soundStorage={this.soundStorage}
      />
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundry>
      <DocumentTitle title="SR 2020 Магия">
        <AuthWrapper loginManager={loginManager}>
          <AudioContainer />
        </AuthWrapper>
      </DocumentTitle>
    </ErrorBoundry>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
