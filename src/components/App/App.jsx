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

import { Map2 } from '../Map2';
import { ErrorBoundry } from '../ErrorBoundry';
import { SoundManager } from '../SoundManager';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';
import { AudioContextWrapper } from '../../utils/AudioContextWrapper';

import { SpiritEditor } from '../SpiritEditor';

import { AppPropTypes } from '../../types';

import { GameModel } from '../../services/GameModel';
import { Migrator } from '../../services/Migrator';

import { services } from '../../services/GameModelServices';

import { fillGameModelWithBots } from '../../services/GameModelFiller';

import { mapConfig } from '../../configs/map';

import { GeoDataStreamSimulator } from '../GeoDataStreamSimulator';

import { SoundMapper } from '../SoundMapper';

import { AppHeader } from './AppHeader';

import { SoundWatcher } from '../SoundWatcher';

import { SoundStage } from './SoundStage';

import { Translator } from '../Map2/Translator';

const hardDispose = (obj) => Object.keys(obj).forEach((key) => { delete obj[key]; });

const STORAGE_KEY = 'AR_POC';

const TEST_POSITION = {
  coords: {
    latitude: 52.2982526,
    longitude: 104.1270739,
  },
};

let database = localStorage.getItem(STORAGE_KEY);
if (database) {
  database = JSON.parse(database);
} else {
  database = {};
}

export class App extends Component {
  audioContextWrapper = new AudioContextWrapper();

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
    const gameModel = new GameModel();
    gameModel.init(services, Migrator);
    gameModel.setData(database);

    fillGameModelWithBots(gameModel);

    this.soundStage.subscribeOnModel(gameModel);
    this.setState({
      gameModel,
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
        state.gameModel.dispose();
        hardDispose(state.gameModel);

        const gameModel = new GameModel();
        gameModel.init(services, Migrator);
        gameModel.setData(database2);
        fillGameModelWithBots(gameModel);
        this.soundStage.subscribeOnModel(gameModel);
        return {
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

    // this.setState({
    //   curPosition: [TEST_POSITION.coords.latitude, TEST_POSITION.coords.longitude],
    //   waitingForGeolocation: false,
    // });

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
      simulateGeoDataStream, curPosition, waitingForGeolocation, gameModel,
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
