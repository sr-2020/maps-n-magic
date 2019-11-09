import React, { Component } from 'react';
import './App.css';
import '../../css/tailwind.css';
// import './Icons.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import * as R from 'ramda';

import {
  BrowserRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';

import { AudioService } from '../../services/audioService';
import { DataService } from '../../services/DataService';
import { SpiritService } from '../../services/SpiritService';

// import getBeacons from '../../utils/gpxExperiment';


import { Prototype1 } from '../Prototype1';
import { MapEditor } from '../MapEditor';
import { MusicEditor } from '../MusicEditor';
import { Beacons } from '../Beacons';
import { Map2 } from '../Map2';
import { ErrorBoundry } from '../ErrorBoundry';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';

import 'bootstrap/dist/css/bootstrap.min.css';
import { SpiritEditor } from '../SpiritEditor';

// console.log(getBeacons(100, 100, 600, 500));

const STORAGE_KEY = 'AR_POC';

const defaultImgUrl = '/images/backgroundImage.jpg';

let initialState;
// let audioData = [];
const database = localStorage.getItem(STORAGE_KEY);
if (database) {
  const parsedDb = JSON.parse(database);
  initialState = parsedDb.appState;
  // audioData = database.audioData;
  // console.log('audioData', audioData);
  // initialState.beacons = getBeacons(100, 100, initialState.svgWidth - 200, initialState.svgHeight - 200).map(beacon => ({
  //   ...beacon,
  //   props: {
  //     sound: 'none'
  //   }
  // }));
} else {
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

  constructor() {
    super();
    this.state = {
      dataService: new DataService(),
      spiritService: new SpiritService(),
      ...initialState,
    };
  }

  componentDidMount() {
    // initSound(() => {
    //   this.setState({
    //     soundsLoaded: true
    //   });
    // });
    // this.animatePlayer();
    setInterval(() => {
      console.log('saving app state in local storage');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prepareDataForJson()));
    }, 10000);
  }

  prepareDataForJson = () => {
    // console.log('sdfs');
    const data = this.audioService.toJson();
    const { dataService, spiritService } = this.state;
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
      spirits: spiritService.getSpirits(),
    });
  }

  onStateChange = (prop, toType) => (e) => {
    // console.log('prop');
    this.setState({
      [prop]: toType(e.target.value),
    });
  }

  setBeacons = (beacons) => {
    // console.log('prop');
    this.setState({
      beacons,
    });
  }

  setMainPolygon = (mainPolygon) => {
    // console.log('prop');
    this.setState({
      mainPolygon,
    });
  }

  setImageUrl = (imageUrl) => {
    // console.log('prop');
    this.setState({
      imageUrl,
    });
  }

  toDefaultImageUrl = () => this.setImageUrl(defaultImgUrl);

  downloadDatabaseAsFile = () => {
    json2File(this.prepareDataForJson(), makeFileName('SR_acoustic_poc', 'json', new Date()));
  };

  uploadDatabaseFile = (evt) => {
    const input = evt.target.querySelector('input');
    if (input) {
      input.value = '';
      input.click();
    }
  };

  onFileSelected = (evt) => {
    readJsonFile(evt).then((database2) => {
      // console.log(database2.appState);
      const {
        beacons, locations, spirits,
      } = database2;
      this.setState({
        dataService: new DataService({
          beacons,
          locations,
        }),
        spiritService: new SpiritService({
          spirits,
        }),
      });
      // this.setState(database2.appState);
    });
  };


  // eslint-disable-next-line max-lines-per-function
  render() {
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, beacons, mainPolygon, imageUrl,
      dataService, spiritService,
    } = this.state;

    return (
      <React.StrictMode>
        <ErrorBoundry>

          <Router>
            <div className="App flex flex-col h-screen">
              <header className="flex-0-0-auto">
                <nav className="view-switch">
                  <ul>
                    <li>
                      <NavLink to="/mapEditor">Map Editor</NavLink>
                    </li>
                    <li>
                      <NavLink to="/beacons">Beacons</NavLink>
                    </li>
                    <li>
                      <NavLink to="/soundManager">Sound Manager</NavLink>
                    </li>
                    <li>
                      <NavLink to="/demo">Demo</NavLink>
                    </li>
                    <li>
                      <NavLink to="/map2">Map2</NavLink>
                    </li>
                    <li>
                      <NavLink to="/spiritEditor">Spirit Editor</NavLink>
                    </li>
                  </ul>

                  <ul>
                    <li>
                      {/* className="dataLoadButton icon-button action-button mainNavButton" */}
                      <button
                        type="button"
                        data-original-title=""
                        title="Upload database"
                        onClick={this.uploadDatabaseFile}
                      >
                        <input
                          type="file"
                          className="display-none"
                          tabIndex="-1"
                          onChange={this.onFileSelected}
                        />
                      Upload database
                      </button>
                    </li>
                    <li>
                      {/* className="dataSaveButton icon-button action-button mainNavButton" */}
                      <button
                        type="button"
                        data-original-title=""
                        onClick={this.downloadDatabaseAsFile}
                        title="Download database"
                      >
                      Download database
                      </button>
                    </li>
                  </ul>
                </nav>
              </header>

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
                    <Map2 dataService={dataService} />
                  </Route>
                  <Route path="/spiritEditor">
                    <SpiritEditor spiritService={spiritService} />
                  </Route>

                  <Route render={() => <Redirect to="/spiritEditor" />} />
                  {/* <Route render={() => <Redirect to="/map2" />} /> */}
                </Switch>
              </main>
            </div>
          </Router>
        </ErrorBoundry>
      </React.StrictMode>

    );
  }
}
