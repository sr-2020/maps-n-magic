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

import { 
  ErrorBoundry,
  NotificationWatcher,
  json2File, 
  makeFileName, 
  readJsonFile,
  MapDefaultsProvider,
  TranslatorProvider,
  Translator
} from 'sr2020-mm-client-core';

import { 
  GameModel,
  EventEngine
} from "sr2020-mm-event-engine";

import {
  makeGameModel,
} from 'sr2020-mm-client-event-engine';
import { WithTranslation } from 'react-i18next';

import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SpiritEditor } from '../SpiritEditor';
import { SpiritRouteEditor } from '../SpiritRouteEditor';

// import { AppPropTypes } from '../../types';

// import { SoundManager } from '../SoundManager';

// import { mapDefaults } from '../../configs/map';
import { mapDefaults } from '../../configs';
// import * as mapDefaults from '../../configs/map';
// import { defaultCenter } from '../../configs/map';

// import { GeoDataStreamSimulator } from '../GeoDataStreamSimulator';
import { CharacterPositions } from '../CharacterPositions';
import { ManaOceanSettings } from '../ManaOceanSettings';
import { ManaOceanEffectSettings } from '../ManaOceanEffectSettings';
import { SpiritNav } from "../SpiritNav";

// import { SoundMapper } from '../SoundMapper';

import { AppHeader } from './AppHeader';

import { SoundWatcher } from '../SoundWatcher';

// import { SoundStage } from './SoundStage';

import { BeaconRecordEditor } from '../BeaconRecordEditor';
import { RescueServiceMessageSender } from '../RescueServiceMessageSender';

import { MapRoutes } from '../MapRoutes';

import { LoginManager, SoundStorage } from "../../utils";
import { SoundStageEcho } from '../SoundManager/SoundStageEcho';
import { SoundStageGuard } from '../SoundStageGuard';
import { SoundResumer } from '../SoundResumer';


const STORAGE_KEY = 'AR_POC';

const TEST_POSITION = {
  coords: {
    // latitude: 52.2982526,
    // longitude: 104.1270739,
    latitude: 54.92822999834723,
    longitude: 36.88105243803666,
  },
};

const initialDatabaseStr = localStorage.getItem(STORAGE_KEY);
const initialDatabase = {};
// if (initialDatabaseStr) {
//   initialDatabase = JSON.parse(initialDatabaseStr);
// }

interface AppProps extends WithTranslation {
  loginManager: LoginManager;
};
interface AppState {
  simulateGeoDataStream: boolean;
  translator: Translator;
  waitingForGeolocation: boolean;
  gameServer: EventEngine | null;
  gameModel: GameModel | null;
  initialized: boolean;
};

export class App extends Component<AppProps, AppState> {
  audioContextWrapper = new AudioContextWrapper();

  soundStorage = new SoundStorage(this.audioContextWrapper);

  // soundStage = new SoundStage(this.audioContextWrapper);

  saveDataInLsId: NodeJS.Timeout;

  watchGeolocationId: number;

  // static propTypes = AppPropTypes;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      simulateGeoDataStream: false,
      translator: new Translator(mapDefaults.defaultCenter, null),
      waitingForGeolocation: false,
      gameServer: null,
      gameModel: null,
      initialized: false,
    };
    // onUploadFileSelected
    // downloadDatabaseAsFile
    // onSaveDataInLs
    // const funcs = `
    // switchMovementMode
    // jumpToUserCoords
    // onGetPosition
    // `.split('\n').map(R.trim).filter(R.pipe(R.isEmpty, R.not));
    
    // funcs.forEach((funcName) => (this[funcName] = this[funcName].bind(this)));
    this.switchMovementMode = this.switchMovementMode.bind(this);
    this.jumpToUserCoords = this.jumpToUserCoords.bind(this);
    this.onGetPosition = this.onGetPosition.bind(this);
  }

  componentDidMount() {
    const { gameModel, gameServer } = makeGameModel();
    // this.soundStage.subscribeOnModel(gameModel);
    this.setState({
      translator: new Translator(mapDefaults.defaultCenter, null),
      gameServer,
      gameModel,
      initialized: true,
    });
    // this.saveDataInLsId = setInterval(this.onSaveDataInLs, 10000);
    this.watchGeolocationId = navigator.geolocation.watchPosition(this.onGetPosition);
    // setInterval(this.onGetPosition, 1000);
    // window.addEventListener('beforeunload', this.onSaveDataInLs);
  }

  componentWillUnmount() {
    clearInterval(this.saveDataInLsId);
    // navigator.geolocation.clearWatch(this.watchGeolocationId);
    // this.soundStage.dispose();
    // window.removeEventListener('beforeunload', this.onSaveDataInLs);
  }

  // onSaveDataInLs() {
  //   // console.log('saving app state in local storage');
  //   const database2 = this.prepareDataForJson();
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(database2));
  // }

  onGetPosition(position: GeolocationPosition) {
    // console.log(position.coords.latitude, position.coords.longitude);
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.simulateGeoDataStream) {
      return;
    }

    // position = TEST_POSITION;

    // eslint-disable-next-line react/destructuring-assignment
    const { translator } = this.state;

    // const coords = translator.moveFrom({
    //   lat: position.coords.latitude,
    //   lng: position.coords.longitude,
    // });
    const coords = ({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });

    position = {
      ...position,
      coords: {
        ...position.coords,
        latitude: coords.lat,
        longitude: coords.lng,
      },
    };

    const artificialPos: GeolocationPosition = {
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
    // this.state.gameModel.execute({
    //   type: 'updateUserPosition',
    //   pos: artificialPos,
    // });
  }

  // onUploadFileSelected(evt) {
  //   readJsonFile(evt).then((database2) => {
  //     // console.log(database2.appState);
  //     this.setState((state) => {
  //       state.gameServer.dispose();

  //       const { gameModel, gameServer } = makeGameModel(database2);
  //       this.soundStage.subscribeOnModel(gameModel);
  //       return {
  //         gameServer,
  //         gameModel,
  //       };
  //     });
  //   });
  // }

  // prepareDataForJson() {
  //   const { gameModel } = this.state;
  //   return gameModel.getData();
  // }

  // downloadDatabaseAsFile() {
  //   const database2 = this.prepareDataForJson();
  //   json2File(database2, makeFileName('SR_acoustic_poc', 'json', new Date()));
  // }

  switchMovementMode(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.setState(({ simulateGeoDataStream }) => ({
      simulateGeoDataStream: !simulateGeoDataStream,
    }));
  }

  jumpToUserCoords(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.setState((prevState) => {
      const { translator, waitingForGeolocation } = prevState;
      const virtualCenter = translator.getVirtualCenter();
      if (virtualCenter) {
        return {
          translator: new Translator(mapDefaults.defaultCenter, null),
          waitingForGeolocation
        };
      }
      this.jumpToUserCoords2();
      return {
        translator,
        waitingForGeolocation: true,
      };
    });
  }

  jumpToUserCoords2() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    // const virtualCenter = [TEST_POSITION.coords.latitude, TEST_POSITION.coords.longitude];
    // this.setState({
    //   translator: new Translator(mapDefaults.defaultCenter, virtualCenter),
    //   waitingForGeolocation: false,
    // });
    // return;

    const success = (position: GeolocationPosition) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      this.setState({
        translator: new Translator(mapDefaults.defaultCenter, [latitude, longitude]),
        waitingForGeolocation: false,
      });
    };

    function error(this: App) {
      console.error('Unable to retrieve your location');
      this.setState({
        waitingForGeolocation: false,
      });
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      simulateGeoDataStream, waitingForGeolocation, gameModel, translator,
    } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.initialized || gameModel === null) {
      return null;
    }

    const {
      t, loginManager
    } = this.props;

    return (
      <DocumentTitle title={t('appTitle')}>
        <MapDefaultsProvider value={mapDefaults}>
          <TranslatorProvider value={translator}>
            <Router>
              <div className="App tw-flex tw-flex-col tw-h-screen">
                <AppHeader
                  gameModel={gameModel}
                  loginManager={loginManager}
                  waitingForGeolocation={waitingForGeolocation}
                  simulateGeoDataStream={simulateGeoDataStream}
                  // onUploadFileSelected={this.onUploadFileSelected}
                  // downloadDatabaseAsFile={this.downloadDatabaseAsFile}
                  jumpToUserCoords={this.jumpToUserCoords}
                  switchMovementMode={this.switchMovementMode}
                />

                <main className="tw-flex-auto tw-h-full">
                  <Switch>
                    <Route path="/spiritNav">
                      <SpiritNav />
                    </Route>,
                    <Route path="/spiritEditor">
                      <SpiritEditor gameModel={gameModel} />
                    </Route>
                    <Route path="/spiritRouteEditor">
                      <SpiritRouteEditor gameModel={gameModel} />
                    </Route>
                    {/* <Route path="/soundManager2">
                      <SoundManager
                        gameModel={gameModel}
                        soundStage={this.soundStage}
                      />
                    </Route> */}
                    {/* <Route path="/soundMapping">
                      <SoundMapper gameModel={gameModel} />
                    </Route> */}
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
                    <Route path="/manaOceanEffectSettings">
                      <ManaOceanEffectSettings gameModel={gameModel} />
                    </Route>

                    {/* MapRoutes is NOT a component. This is a function which returns array.
                    It is necessary to extract routes from switch to separate component.
                    This is problem of router implementation */}
                    {MapRoutes({
                      gameModel,
                    })}
                    <Route path="/">
                      <Redirect to="/mapsNav" />
                    </Route>
                  </Switch>
                  {/* { refactor as GeoDataStreamSimulator } */}
                  {/* <GeoDataStreamSimulator
                    simulateGeoDataStream={simulateGeoDataStream}
                    gameModel={gameModel}
                  /> */}
                  {/* { refactor as SoundManager and SoundProvider } */}
                  {/* <SoundWatcher
                    gameModel={gameModel}
                    context={this.audioContextWrapper}
                  /> */}
                  <NotificationWatcher gameModel={gameModel} />
                  {/* { refactor as CharacterHealthStateSimulator } */}
                  {/* <CharacterHealthStateSimulator gameModel={gameModel} /> */}
                  {/* { refactor as CharacterHealthStateManager and CharacterHealthStateProvider } */}

                  {/* TODO CharacterHealthListener should be in event engine
                    This is a fictive component for polling character health status
                  */}
                  {/* <CharacterHealthListener gameModel={gameModel} /> */}
                  {/* <SoundStageEcho gameModel={gameModel} /> */}
                  <SoundStageGuard 
                    gameModel={gameModel}
                    audioContextWrapper={this.audioContextWrapper}
                    soundStorage={this.soundStorage}
                  />
                  <SoundResumer 
                    audioContext={this.audioContextWrapper.context}
                  />
                </main>
              </div>
            </Router>
          </TranslatorProvider>
        </MapDefaultsProvider>
      </DocumentTitle>
    );
  }
}
