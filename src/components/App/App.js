import React, { Component, Fragment } from 'react';
import './App.css';
// import './Icons.css';
// import '@fortawesome/fontawesome-free/css/all.css';
import * as R from 'ramda';
import shortid from 'shortid';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link, NavLink
} from 'react-router-dom';

// import AudioService from '../../services/audioService';


// import getBeacons from '../../utils/gpxExperiment';

import Button from 'react-bootstrap/Button';
import Prototype1 from '../Prototype1';
import MapEditor from '../MapEditor';
import MusicEditor from '../MusicEditor';
import Beacons from '../Beacons';
import ErrorBoundry from '../ErrorBoundry';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';

import 'bootstrap/dist/css/bootstrap.min.css';

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
    imageUrl: defaultImgUrl
  };
}

export default class App extends Component {
  state = {
    ...initialState,
    showBeaconsTab: true
  };

  // audioService = new AudioService();

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

  prepareDataForJson = () =>
    // console.log('sdfs');
    // const data = this.audioService.toJson();
    // console.log()
    // this.audioService.fromJson(data);
    ({
      appState: this.state,
      // audioData: data
    })


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

  setImageUrl = (imageUrl) => {
    // console.log('prop');
    this.setState({
      imageUrl
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
      console.log(database2.appState);
      this.setState(database2.appState);
    });
  };


  render() {
    const {
      imagePositionX, imagePositionY, imageOpacity, imageScale, svgWidth, svgHeight, beacons, mainPolygon, imageUrl, showBeaconsTab
    } = this.state;

    return (
      <ErrorBoundry>

        {/* <Router> */}
        <div className="App">
          <header>
            <nav className="view-switch">
              <ul>
                <li>
                  {/* <NavLink to="/mapEditor">Map Editor</NavLink> */}
                  <Button
                    variant={showBeaconsTab ? 'default' : 'primary'}
                    onClick={() => (this.setState({
                      showBeaconsTab: false
                    }))}
                  >Map Editor
                  </Button>
                </li>
                <li>
                  {/* <NavLink to="/beacons">Beacons</NavLink> */}
                  <Button
                    variant={!showBeaconsTab ? 'default' : 'primary'}
                    onClick={() => (this.setState({
                      showBeaconsTab: true
                    }))}
                  >Beacons
                  </Button>
                </li>
                {/* <li>
                    <NavLink to="/soundManager">Sound Manager</NavLink>
                  </li>
                  <li>
                    <NavLink to="/demo">Demo</NavLink>
                  </li> */}
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
                  >Download database
                  </button>
                </li>
              </ul>
            </nav>
          </header>

          <main>

            {/* <Switch> */}
            {/* <Route path="/mapEditor"> */}
            {!showBeaconsTab && (
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
            )}
            {/* </Route>
                <Route path="/beacons"> */}
            {showBeaconsTab && (
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
            )}
            {/* </Route> */}
            {/* <Route path="/soundManager">
                  <MusicEditor audioService={this.audioService} />
                </Route>
                <Route path="/demo">
                  <Prototype1
                    svgWidth={svgWidth}
                    svgHeight={svgHeight}
                    beacons={beacons}
                    audioService={this.audioService}
                  />
                </Route> */}

            {/* <Route render={() => <Redirect to="/beacons" />} /> */}
            {/* </Switch> */}
          </main>
        </div>
        {/* </Router> */}
      </ErrorBoundry>

    );
  }
}