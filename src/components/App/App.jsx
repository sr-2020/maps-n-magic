import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/tailwind.css';
import './App.css';
// import './Icons.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import * as R from 'ramda';

import DocumentTitle from 'react-document-title';

import {
  BrowserRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';

import { SoundService } from '../../services/SoundService';

import { Map2 } from '../Map2';
import { ErrorBoundry } from '../ErrorBoundry';
import { SoundManager } from '../SoundManager';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';
import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SoundPlayer } from '../../utils/SoundPlayer';


import { SpiritEditor } from '../SpiritEditor';

import { AppPropTypes } from '../../types';

import { GameModel } from '../../services/GameModel';

import { services } from '../../services/GameModelServices';

import { fillGameModelWithBots } from '../../services/GameModelFiller';

import { UserWatcher } from './UserWatcher';

import { mapConfig } from '../../configs/map';

import { GeoDataStreamSimulator } from '../GeoDataStreamSimulator';

import { SoundMapper } from '../SoundMapper';

import { AppHeader } from './AppHeader';

import { SoundWatcher } from '../SoundWatcher';

import { SoundStage } from './SoundStage';

const hardDispose = (obj) => Object.keys(obj).forEach((key) => { delete obj[key]; });

const STORAGE_KEY = 'AR_POC';

let database = localStorage.getItem(STORAGE_KEY);
if (database) {
  database = JSON.parse(database);
} else {
  database = {};
}

export class App extends Component {
  audioContextWrapper = new AudioContextWrapper();

  soundPlayer = new SoundPlayer(this.audioContextWrapper);

  soundStage = new SoundStage(this.audioContextWrapper);

  static propTypes = AppPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      simulateGeoDataStream: false,
      curPosition: null,
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
    const soundService = new SoundService(this.soundPlayer);
    const gameModel = new GameModel();
    gameModel.init(services);
    gameModel.setData(database);

    fillGameModelWithBots(gameModel);
    this.userWatcher = new UserWatcher(soundService, gameModel);

    this.soundStage.subscribeOnModel(gameModel);
    this.setState({
      soundService,
      gameModel,
      initialized: true,
    });
    this.saveDataInLsId = setInterval(this.onSaveDataInLs, 10000);
    this.watchGeolocationId = navigator.geolocation.watchPosition(this.onGetPosition);
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
        state.soundService.dispose();
        state.gameModel.dispose();
        hardDispose(state.soundService);
        hardDispose(state.gameModel);

        const gameModel = new GameModel();
        gameModel.init(services);
        gameModel.setData(database2);
        const soundService = new SoundService(this.soundPlayer);
        fillGameModelWithBots(gameModel);
        this.soundStage.subscribeOnModel(gameModel);
        this.userWatcher.dispose();
        this.userWatcher = new UserWatcher(soundService, gameModel);
        return {
          soundService,
          gameModel,
        };
      });
    });
  }

  prepareDataForJson() {
    const { gameModel } = this.state;
    return ({
      ...gameModel.getData(),
      version: '0.1.0',
    });
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

    const success = (position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      this.setState({
        curPosition: [latitude, longitude],
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
      soundService, simulateGeoDataStream, curPosition, waitingForGeolocation, gameModel,
    } = this.state;

    const {
      t,
    } = this.props;

    return (
      <React.StrictMode>
        <ErrorBoundry>
          <DocumentTitle title={t('appTitle')}>
            <Router>
              <div className="App flex flex-col h-screen">
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

                <main className="flex-1-1-auto h-full">
                  <Switch>
                    <Route path="/map2">
                      <Map2
                        soundService={soundService}
                        simulateGeoDataStream={simulateGeoDataStream}
                        curPosition={curPosition}
                        gameModel={gameModel}
                        mapConfig={mapConfig}
                      />
                    </Route>
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

                    <Route render={() => <Redirect to="/soundManager2" />} />
                  </Switch>
                  <GeoDataStreamSimulator
                    simulateGeoDataStream={simulateGeoDataStream}
                    gameModel={gameModel}
                    curPosition={curPosition}
                    center={mapConfig.center}
                  />
                  <SoundWatcher
                    gameModel={gameModel}
                    context={this.audioContextWrapper}
                  />
                </main>
              </div>
            </Router>
          </DocumentTitle>
        </ErrorBoundry>
      </React.StrictMode>

    );
  }
}
