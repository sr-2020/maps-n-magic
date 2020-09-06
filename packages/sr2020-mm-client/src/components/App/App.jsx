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

import {
  makeGameModel,
} from 'sr2020-mm-event-engine/configs/clientEventEngine';

import { NotificationWatcher } from 'sr2020-mm-client-core/components/NotificationWatcher';
import { json2File, makeFileName, readJsonFile } from 'sr2020-mm-client-core/utils/fileUtils';
import { AudioContextWrapper } from '../../utils/AudioContextWrapper';

import { SpiritEditor } from '../SpiritEditor';

// import { AppPropTypes } from '../../types';

import { SoundManager } from '../SoundManager';

import { mapConfig } from '../../configs/map';

import { GeoDataStreamSimulator } from '../GeoDataStreamSimulator';
import { CharacterHealthStateSimulator } from '../CharacterHealthStateSimulator';
import { CharacterHealthListener } from '../CharacterHealthListener';
import { CharacterPositions } from '../CharacterPositions';
import { ManaOceanSettings } from '../ManaOceanSettings';

import { SoundMapper } from '../SoundMapper';

import { AppHeader } from './AppHeader';

import { SoundWatcher } from '../SoundWatcher';

import { SoundStage } from './SoundStage';

import { Translator } from '../../utils/Translator';

import { BeaconRecordEditor } from '../BeaconRecordEditor';
import { RescueServiceMessageSender } from '../RescueServiceMessageSender';

import { TrackAnalysis } from '../../trackAnalysis/TrackAnalysis';


import { MapRoutes } from '../MapRoutes';


const STORAGE_KEY = 'AR_POC';

const TEST_POSITION = {
  coords: {
    // latitude: 52.2982526,
    // longitude: 104.1270739,
    latitude: 54.92822999834723,
    longitude: 36.88105243803666,
  },
};

let initialDatabase = localStorage.getItem(STORAGE_KEY);
if (initialDatabase) {
  initialDatabase = JSON.parse(initialDatabase);
} else {
  initialDatabase = {};
}

export class App extends Component {
  audioContextWrapper = new AudioContextWrapper();

  soundStage = new SoundStage(this.audioContextWrapper);

  // static propTypes = AppPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      simulateGeoDataStream: false,
      curPosition: null,
      translator: null,
      waitingForGeolocation: false,
      initialized: false,
    };
    const funcs = `
    switchMovementMode
    jumpToUserCoords
    onUploadFileSelected
    downloadDatabaseAsFile
    onGetPosition
    onSaveDataInLs
    `.split('\n').map(R.trim).filter(R.pipe(R.isEmpty, R.not));

    funcs.forEach((funcName) => (this[funcName] = this[funcName].bind(this)));
  }


  componentDidMount() {
    const { gameModel, gameServer } = makeGameModel(initialDatabase);
    this.soundStage.subscribeOnModel(gameModel);
    this.setState({
      gameServer,
      gameModel,
      translator: new Translator(mapConfig.center, null),
      initialized: true,
    });
    this.saveDataInLsId = setInterval(this.onSaveDataInLs, 10000);
    this.watchGeolocationId = navigator.geolocation.watchPosition(this.onGetPosition);
    // setInterval(this.onGetPosition, 1000);
    window.addEventListener('beforeunload', this.onSaveDataInLs);
  }

  componentWillUnmount() {
    clearInterval(this.saveDataInLsId);
    // eslint-disable-next-line no-undef
    clearWatch(this.watchGeolocationId);
    this.soundStage.dispose();
    window.removeEventListener('beforeunload', this.onSaveDataInLs);
  }

  onSaveDataInLs() {
    // console.log('saving app state in local storage');
    const database2 = this.prepareDataForJson();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database2));
  }

  onGetPosition(position) {
    // console.log(position.coords.latitude, position.coords.longitude);
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.simulateGeoDataStream) {
      return;
    }

    // position = TEST_POSITION;

    // eslint-disable-next-line react/destructuring-assignment
    const translator = new Translator(mapConfig.center, this.state.curPosition);

    const coords = translator.moveFrom({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });

    position = {
      coords: {
        latitude: coords.lat,
        longitude: coords.lng,
      },
    };

    const artificialPos = {
      coords: {
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: null,
      },
      timestamp: Date.now(),
      // artificial: true,
    };

    // eslint-disable-next-line react/destructuring-assignment
    this.state.gameModel.execute({
      type: 'updateUserPosition',
      pos: artificialPos,
    });
  }

  onUploadFileSelected(evt) {
    readJsonFile(evt).then((database2) => {
      // console.log(database2.appState);
      this.setState((state) => {
        state.gameServer.dispose();

        const { gameModel, gameServer } = makeGameModel(database2);
        this.soundStage.subscribeOnModel(gameModel);
        return {
          gameServer,
          gameModel,
        };
      });
    });
  }

  prepareDataForJson() {
    const { gameModel } = this.state;
    return gameModel.getData();
  }

  downloadDatabaseAsFile() {
    const database2 = this.prepareDataForJson();
    json2File(database2, makeFileName('SR_acoustic_poc', 'json', new Date()));
  }

  switchMovementMode(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState(({ simulateGeoDataStream }) => ({
      simulateGeoDataStream: !simulateGeoDataStream,
    }));
  }

  jumpToUserCoords(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState(({ curPosition }) => {
      if (curPosition) {
        return {
          curPosition: null,
          translator: new Translator(mapConfig.center, null),
        };
      }
      this.jumpToUserCoords2();
      return {
        waitingForGeolocation: true,
      };
    });
  }

  jumpToUserCoords2() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    // const curPosition = [TEST_POSITION.coords.latitude, TEST_POSITION.coords.longitude];
    // this.setState({
    //   curPosition,
    //   translator: new Translator(mapConfig.center, curPosition),
    //   waitingForGeolocation: false,
    // });
    // return;

    const success = (position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      this.setState({
        curPosition: [latitude, longitude],
        translator: new Translator(mapConfig.center, [latitude, longitude]),
        waitingForGeolocation: false,
      });
    };

    function error() {
      console.error('Unable to retrieve your location');
      this.setState({
        waitingForGeolocation: false,
      });
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.initialized) {
      return null;
    }

    const {
      simulateGeoDataStream, curPosition, waitingForGeolocation, gameModel, translator,
    } = this.state;

    const {
      t,
    } = this.props;

    return (
      <React.StrictMode>
        <ErrorBoundry>
          <DocumentTitle title={t('appTitle')}>
            <Router>
              <div className="App tw-flex tw-flex-col tw-h-screen">
                <AppHeader
                  gameModel={gameModel}
                  waitingForGeolocation={waitingForGeolocation}
                  curPosition={curPosition}
                  simulateGeoDataStream={simulateGeoDataStream}
                  onUploadFileSelected={this.onUploadFileSelected}
                  downloadDatabaseAsFile={this.downloadDatabaseAsFile}
                  jumpToUserCoords={this.jumpToUserCoords}
                  switchMovementMode={this.switchMovementMode}
                />

                <main className="tw-flex-auto tw-h-full">
                  <Switch>
                    <Route path="/spiritEditor">
                      <SpiritEditor spiritService={gameModel} />
                    </Route>
                    <Route path="/soundManager2">
                      <SoundManager
                        gameModel={gameModel}
                        soundStage={this.soundStage}
                      />
                    </Route>
                    <Route path="/soundMapping">
                      <SoundMapper gameModel={gameModel} />
                    </Route>
                    <Route path="/beaconRecordEditor">
                      <BeaconRecordEditor gameModel={gameModel} />
                    </Route>
                    <Route path="/rescueServiceMessageSender">
                      <RescueServiceMessageSender gameModel={gameModel} />
                    </Route>
                    <Route path="/characterPositions">
                      <CharacterPositions gameModel={gameModel} />
                    </Route>
                    <Route path="/manaOceanSettings">
                      <ManaOceanSettings gameModel={gameModel} />
                    </Route>

                    {TrackAnalysis({
                      curPosition,
                      gameModel,
                      mapConfig,
                      translator,
                    })}
                    {MapRoutes({
                      curPosition,
                      gameModel,
                      translator,
                    })}
                    <Route render={() => <Redirect to="/mapsNav" />} />
                  </Switch>
                  {/* { refactor as GeoDataStreamSimulator } */}
                  <GeoDataStreamSimulator
                    simulateGeoDataStream={simulateGeoDataStream}
                    gameModel={gameModel}
                    curPosition={curPosition}
                    center={mapConfig.center}
                    translator={translator}
                  />
                  {/* { refactor as SoundManager and SoundProvider } */}
                  <SoundWatcher
                    gameModel={gameModel}
                    context={this.audioContextWrapper}
                  />
                  <NotificationWatcher gameModel={gameModel} />
                  {/* { refactor as CharacterHealthStateSimulator } */}
                  {/* <CharacterHealthStateSimulator gameModel={gameModel} /> */}
                  {/* { refactor as CharacterHealthStateManager and CharacterHealthStateProvider } */}

                  {/* TODO CharacterHealthListener should be in event engine 
                    This is a fictive component for polling character health status
                  */}
                  <CharacterHealthListener gameModel={gameModel} />
                </main>
              </div>
            </Router>
          </DocumentTitle>
        </ErrorBoundry>
      </React.StrictMode>

    );
  }
}
