import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sr2020-mm-client-core/css/tailwind.css';
import './App.css';
// import './Icons.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import * as R from 'ramda';

import DocumentTitle from 'react-document-title';

import {
  HashRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';

import { ErrorBoundry } from 'sr2020-mm-client-core/components/ErrorBoundry';

// import {
//   makeGameModel,
// } from 'sr2020-mm-event-engine/configs/clientEventEngine';

// import { NotificationWatcher } from 'sr2020-mm-client-core/components/NotificationWatcher';
// import { json2File, makeFileName, readJsonFile } from 'sr2020-mm-client-core/utils/fileUtils';
import { MapDefaultsProvider } from 'sr2020-mm-client-core/mapDefaultsContext';
import { TranslatorProvider } from 'sr2020-mm-client-core/translatorContext';

import { Translator } from 'sr2020-mm-client-core/utils/Translator';
import * as mapDefaults from '../../configs/map';

import { AppHeader } from './AppHeader';

import { TrackAnalysis } from '../../trackAnalysis/TrackAnalysis';

// const STORAGE_KEY = 'AR_POC';

// const TEST_POSITION = {
//   coords: {
//     // latitude: 52.2982526,
//     // longitude: 104.1270739,
//     latitude: 54.92822999834723,
//     longitude: 36.88105243803666,
//   },
// };

// const initialDatabaseStr = localStorage.getItem(STORAGE_KEY);
// let initialDatabase = {};
// if (initialDatabaseStr) {
//   initialDatabase = JSON.parse(initialDatabaseStr);
// }

const translator = new Translator(mapDefaults.defaultCenter, null);

// eslint-disable-next-line react/prefer-stateless-function
export class App extends Component {
  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      t,
    } = this.props;

    return (
      <React.StrictMode>
        <ErrorBoundry>
          <DocumentTitle title={t('appTitle')}>
            <MapDefaultsProvider value={mapDefaults}>
              <TranslatorProvider value={translator}>
                <Router>
                  <div className="App tw-flex tw-flex-col tw-h-screen">
                    <AppHeader />

                    <main className="tw-flex-auto tw-h-full">
                      <Switch>

                        {TrackAnalysis({})}
                        <Route render={() => <Redirect to="/realTrackStats" />} />
                      </Switch>
                    </main>
                  </div>
                </Router>
              </TranslatorProvider>
            </MapDefaultsProvider>
          </DocumentTitle>
        </ErrorBoundry>
      </React.StrictMode>
    );
  }
}
