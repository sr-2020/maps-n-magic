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

import { AudioService } from '../../services/audioService';
import { SoundService } from '../../services/SoundService';
import { DataService } from '../../services/DataService';

// import getBeacons from '../../utils/gpxExperiment';


import { Prototype1 } from '../../outdatedComponents/Prototype1';
import { MapEditor } from '../../outdatedComponents/MapEditor';
import { MusicEditor } from '../../outdatedComponents/MusicEditor';
import { Beacons } from '../../outdatedComponents/Beacons';
import { Map2 } from '../Map2';
import { ErrorBoundry } from '../ErrorBoundry';
import { SoundManager } from '../SoundManager';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';
import { AudioContextWrapper } from '../../utils/AudioContextWrapper';
import { SoundPlayer } from '../../utils/SoundPlayer';


import { SpiritEditor } from '../SpiritEditor';

import { AppPropTypes } from '../../types';

import { GameModel } from '../../services/GameModel';

import { ModelRunControl } from '../ModelRunControl';

import { fillGameModelWithBots } from '../../services/GameModelFiller';

import { UserWatcher } from './UserWatcher';

import { mapConfig } from '../../configs/map';

import { GeoDataStreamSimulator } from '../GeoDataStreamSimulator';

import { SoundMapper } from '../SoundMapper';

import { AppHeader } from './AppHeader';

// console.log(getBeacons(100, 100, 600, 500));

const hardDispose = (obj) => Object.keys(obj).forEach((key) => { delete obj[key]; });

const STORAGE_KEY = 'AR_POC';

const defaultImgUrl = '/images/backgroundImage.jpg';


let initialState;
// let audioData = [];
let database = localStorage.getItem(STORAGE_KEY);
if (database) {
  database = JSON.parse(database);
  initialState = database.appState;
  // audioData = database.audioData;
  // console.log('audioData', audioData);
  // initialState.beacons = getBeacons(100, 100, initialState.svgWidth - 200, initialState.svgHeight - 200).map(beacon => ({
  //   ...beacon,
  //   props: {
  //     sound: 'none'
  //   }
  // }));
} else {
  database = {};
  initialState = {
    svgWidth: 800,
    svgHeight: 581,
    imagePositionX: 50,
    imagePositionY: 68,
    imageOpacity: 80,
    imageScale: 800,
    beacons: [],
    mainPolygon: [[324, 80], [128, 370], [543, 560], [610, 454], [459, 414], [458, 302], [428, 301], [423, 135], [348, 79], [324, 80]],
    imageUrl: defaultImgUrl,
  };
}

export class App extends Component {
  audioService = new AudioService();

  audioContextWrapper = new AudioContextWrapper();

  soundPlayer = new SoundPlayer(this.audioContextWrapper);

  static propTypes = AppPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      simulateGeoDataStream: false,
      ...initialState,
      curPosition: null,
      waitingForGeolocation: false,
      initialized: false,
    };
    const funcs = `
    switchMovementMode
    jumpToUserCoords
    onUploadFileSelected
    setBeacons
    setMainPolygon
    setImageUrl
    downloadDatabaseAsFile
    onStateChange
    onGetPosition
    onSaveDataInLs
    `.split('\n').map(R.trim).filter(R.pipe(R.isEmpty, R.not));

    funcs.forEach((funcName) => (this[funcName] = this[funcName].bind(this)));
  }

  componentDidMount() {
    const {
      beacons, locations,
    } = database;
    const dataService = new DataService({
      beacons,
      locations,
    });
    const soundService = new SoundService(this.audioContextWrapper, this.soundPlayer);
    const gameModel = new GameModel();
    gameModel.init();
    gameModel.setData(database);

    fillGameModelWithBots(gameModel, dataService.getLocations());
    this.userWatcher = new UserWatcher(soundService, dataService, gameModel);
    this.setState({
      dataService,
      soundService,
      gameModel,
      initialized: true,
    });
    this.saveDataInLsId = setInterval(this.onSaveDataInLs, 10000);
    this.watchGeolocationId = navigator.geolocation.watchPosition(this.onGetPosition);
  }

  componentWillUnmount() {
    clearInterval(this.saveDataInLsId);
    // eslint-disable-next-line no-undef
    clearWatch(this.watchGeolocationId);
  }

  onSaveDataInLs() {
    // console.log('saving app state in local storage');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prepareDataForJson()));
  }

  onGetPosition(position) {
    console.log(position.coords.latitude, position.coords.longitude);
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

    // this.map._handleGeolocationResponse(artificialPos);
    // eslint-disable-next-line react/destructuring-assignment
    this.state.gameModel.execute({
      type: 'updateUserPosition',
      pos: artificialPos,
    });
  }

  onStateChange(prop, toType) {
    return (e) => {
      // console.log('prop');
      this.setState({
        [prop]: toType(e.target.value),
      });
    };
  }

  onUploadFileSelected(evt) {
    readJsonFile(evt).then((database2) => {
      // console.log(database2.appState);
      const {
        beacons, locations, spirits,
      } = database2;
      this.setState((state) => {
        state.soundService.dispose();
        state.gameModel.dispose();
        hardDispose(state.soundService);
        hardDispose(state.dataService);
        hardDispose(state.gameModel);

        const dataService = new DataService({
          beacons,
          locations,
        });
        const gameModel = new GameModel();
        gameModel.init();
        gameModel.setData(database2);
        const soundService = new SoundService(this.audioContextWrapper, this.soundPlayer);
        fillGameModelWithBots(gameModel, dataService.getLocations());
        this.userWatcher.dispose();
        this.userWatcher = new UserWatcher(soundService, dataService, gameModel);
        return {
          dataService,
          soundService,
          gameModel,
        };
      });
      // this.setState(database2.appState);
    });
  }

  setBeacons(beacons) {
    // console.log('prop');
    this.setState({
      beacons,
    });
  }

  setImageUrl(imageUrl) {
    // console.log('prop');
    this.setState({
      imageUrl,
    });
  }

  setMainPolygon(mainPolygon) {
    // console.log('prop');
    this.setState({
      mainPolygon,
    });
  }

  toDefaultImageUrl = () => this.setImageUrl(defaultImgUrl);

  prepareDataForJson() {
    // console.log('sdfs');
    const data = this.audioService.toJson();
    const { dataService, gameModel } = this.state;
    // console.log()
    this.audioService.fromJson(data);
    return ({
      appState: R.pick([
        'svgWidth',
        'svgHeight',
        'imagePositionX',
        'imagePositionY',
        'imageOpacity',
        'imageScale',
        'beacons',
        'mainPolygon',
        'imageUrl'], this.state),
      audioData: data,
      beacons: dataService.getBeacons(),
      locations: dataService.getLocations(),
      ...gameModel.getData(),
      version: '0.1.0',
    });
  }

  downloadDatabaseAsFile() {
    json2File(this.prepareDataForJson(), makeFileName('SR_acoustic_poc', 'json', new Date()));
  }

  // eslint-disable-next-line class-methods-use-this
  // uploadDatabaseFile(evt) {
  //   const input = evt.target.querySelector('input');
  //   if (input) {
  //     input.value = '';
  //     input.click();
  //   }
  // }


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

    // setTimeout(() => {
    //   this.setState({
    //     curPosition: [52.2863655, 104.2921339],
    //     waitingForGeolocation: false,
    //   });
    // }, 3000);

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
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, beacons, mainPolygon, imageUrl,
      dataService, soundService, simulateGeoDataStream, curPosition, waitingForGeolocation, gameModel,
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
                    <Route path="/mapEditor">
                      <MapEditor
                        imagePositionX={imagePositionX}
                        imagePositionY={imagePositionY}
                        imageOpacity={imageOpacity}
                        imageScale={imageScale}
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                        onPropChange={this.onStateChange}
                        mainPolygon={mainPolygon}
                        imageUrl={imageUrl}
                        setImageUrl={this.setImageUrl}
                        toDefaultImageUrl={this.toDefaultImageUrl}
                      />
                    </Route>
                    <Route path="/beacons">
                      <Beacons
                        imagePositionX={imagePositionX}
                        imagePositionY={imagePositionY}
                        imageOpacity={imageOpacity}
                        imageScale={imageScale}
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                        beacons={beacons}
                        setBeacons={this.setBeacons}
                        mainPolygon={mainPolygon}
                        setMainPolygon={this.setMainPolygon}
                        audioService={this.audioService}
                        imageUrl={imageUrl}
                      />
                    </Route>
                    <Route path="/soundManager">
                      <MusicEditor audioService={this.audioService} />
                    </Route>
                    <Route path="/demo">
                      <Prototype1
                        svgWidth={svgWidth}
                        svgHeight={svgHeight}
                        beacons={beacons}
                        audioService={this.audioService}
                      />
                    </Route>
                    <Route path="/map2">
                      <Map2
                        dataService={dataService}
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
                      <SoundManager soundService={soundService} />
                    </Route>
                    <Route path="/soundMapping">
                      <SoundMapper soundService={soundService} />
                    </Route>

                    <Route render={() => <Redirect to="/soundManager2" />} />
                    {/* <Route render={() => <Redirect to="/map2" />} /> */}
                  </Switch>
                  <GeoDataStreamSimulator
                    simulateGeoDataStream={simulateGeoDataStream}
                    gameModel={gameModel}
                    curPosition={curPosition}
                    center={mapConfig.center}
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
