import React, { Component, Fragment } from 'react';
import './App.css';
// import './Icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import * as R from 'ramda';
import shortid from 'shortid';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link, NavLink
} from 'react-router-dom';

import AudioService from '../../services/audioService';


import getBeacons from '../../utils/gpxExperiment';


import Prototype1 from '../Prototype1';
import MapEditor from '../MapEditor';
import MusicEditor from '../MusicEditor';
import Beacons from '../Beacons';
import ErrorBoundry from '../ErrorBoundry';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';

import 'bootstrap/dist/css/bootstrap.min.css';

console.log(getBeacons(100, 100, 600, 500));

const STORAGE_KEY = 'AR_POC';

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
    mainPolygon: [[324.375, 80], [128.375, 370], [543.375, 560], [610.375, 454], [459.375, 414], [458.375, 302], [428.375, 301], [423.375, 135], [348.375, 79], [324.375, 80]],
  };
}

export default class App extends Component {
  state = {
    ...initialState
  };

  audioService = new AudioService();

  componentDidMount() {
    // initSound(() => {
    //   this.setState({
    //     soundsLoaded: true
    //   });
    // });
    // this.animatePlayer();
    setInterval(() => {
      console.log('saving backup');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prepareDataForJson()));
    }, 10000);
  }

  prepareDataForJson = () => {
    // console.log('sdfs');
    const data = this.audioService.toJson();
    // console.log()
    this.audioService.fromJson(data);
    return ({
      appState: this.state,
      audioData: data
    });
  }

  onStateChange = prop => (e) => {
    // console.log('prop');
    this.setState({
      [prop]: e.target.value
    });
  }

  setBeacons = (beacons) => {
    // console.log('prop');
    this.setState({
      beacons
    });
  }

  setMainPolygon = (mainPolygon) => {
    // console.log('prop');
    this.setState({
      mainPolygon
    });
  }

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
      console.log(database2.appState);
      this.setState(database2.appState);
    });
  };


  render() {
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, beacons, mainPolygon
    } = this.state;

    return (
      <ErrorBoundry>

        <Router>
          <div className="App">
            <header>
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
                </ul>

                <ul>
                  <li>
                    <button
                      type="button"
                      className="dataLoadButton icon-button action-button mainNavButton"
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
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dataSaveButton icon-button action-button mainNavButton"
                      data-original-title=""
                      onClick={this.downloadDatabaseAsFile}
                      title="Download database"
                    />
                  </li>
                </ul>
              </nav>
            </header>

            <main>

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

                <Route render={() => <Redirect to="/mapEditor" />} />
              </Switch>
            </main>
          </div>
        </Router>
      </ErrorBoundry>

    );
  }
}
