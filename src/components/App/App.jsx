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

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import { AudioService } from '../../services/audioService';
import { SoundService } from '../../services/SoundService';
import { DataService } from '../../services/DataService';
import { SpiritService } from '../../services/SpiritService';

// import getBeacons from '../../utils/gpxExperiment';


import { Prototype1 } from '../Prototype1';
import { MapEditor } from '../MapEditor';
import { MusicEditor } from '../MusicEditor';
import { Beacons } from '../Beacons';
import { Map2 } from '../Map2';
import { ErrorBoundry } from '../ErrorBoundry';
import { SoundManager } from '../SoundManager';

import { json2File, makeFileName, readJsonFile } from '../../utils/fileUtils';


import { SpiritEditor } from '../SpiritEditor';

import { AppPropTypes } from '../../types';

import { GameModel } from '../../services/GameModel';
import { Bot } from '../../services/Bot';

import { ModelRunControl } from '../ModelRunControl';

// console.log(getBeacons(100, 100, 600, 500));

const hardDispose = (obj) => Object.keys(obj).forEach((key) => { delete obj[key]; });

const STORAGE_KEY = 'AR_POC';

const defaultImgUrl = '/images/backgroundImage.jpg';


const oldNavLinks = [{
  to: '/mapEditor',
  tKey: 'mapEditor',
}, {
  to: '/beacons',
  tKey: 'beacons',
}, {
  to: '/soundManager',
  tKey: 'soundManager',
}, {
  to: '/demo',
  tKey: 'demo',
}];


const navLinks = [{
  to: '/map2',
  tKey: 'map2',
}, {
  to: '/spiritEditor',
  tKey: 'spiritEditor',
}, {
  to: '/soundManager2',
  tKey: 'soundManager2',
}];


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
    onFileSelected
    setBeacons
    setMainPolygon
    setImageUrl
    downloadDatabaseAsFile
    uploadDatabaseFile
    onStateChange
    `.split('\n').map(R.trim).filter(R.pipe(R.isEmpty, R.not));

    funcs.forEach((funcName) => (this[funcName] = this[funcName].bind(this)));
  }

  componentDidMount() {
    const gameModel = new GameModel();
    gameModel.putBot('bot1', new Bot());
    this.setState({
      dataService: new DataService(),
      spiritService: new SpiritService(),
      soundService: new SoundService(),
      gameModel,
      initialized: true,
    });
    setInterval(() => {
      // console.log('saving app state in local storage');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.prepareDataForJson()));
    }, 10000);
  }

  onStateChange(prop, toType) {
    return (e) => {
      // console.log('prop');
      this.setState({
        [prop]: toType(e.target.value),
      });
    };
  }

  onFileSelected(evt) {
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
        hardDispose(state.spiritService);
        const gameModel = new GameModel();
        gameModel.putBot('bot1', new Bot());
        return {
          dataService: new DataService({
            beacons,
            locations,
          }),
          soundService: new SoundService(),
          spiritService: new SpiritService({
            spirits,
          }),
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

  getDownloadButton() {
    const {
      t,
    } = this.props;
    return (
      <Dropdown.Item
        as="button"
        type="button"
        data-original-title=""
        onClick={this.downloadDatabaseAsFile}
        title={t('downloadDatabase')}
        className="py-3 text-xl"
      >
        {t('downloadDatabase')}
      </Dropdown.Item>
    );
  }

  getUploadButton() {
    const {
      t,
    } = this.props;
    return (
      <Dropdown.Item
        as="button"
        type="button"
        data-original-title=""
        title={t('uploadDatabase')}
        onClick={this.uploadDatabaseFile}
        className="py-3 text-xl"
      >
        <input
          type="file"
          className="display-none"
          tabIndex="-1"
          onChange={this.onFileSelected}
        />
        {t('uploadDatabase')}
      </Dropdown.Item>
    );
  }

  getJumpToUserCoordsSwitch() {
    const {
      curPosition, waitingForGeolocation,
    } = this.state;

    const {
      t,
    } = this.props;
    return (
      <Dropdown.Item as="button" onClick={this.jumpToUserCoords}>
        <Form.Check
          type="switch"
          id="jumpToUserCoordsSwitch"
          label={t('jumpToUserCoords')}
          checked={curPosition !== null}
          disabled={waitingForGeolocation}
          className="py-3 text-xl"
          style={{ display: 'inline-block' }}
        >
        </Form.Check>
        {
          waitingForGeolocation && (
            <FontAwesomeIcon
              className="ml-2 text-2xl text-gray-700"
              icon={faSpinner}
              spin
            />
          )
        }
      </Dropdown.Item>
    );
  }

  getMovementSimulatorSwitch() {
    const {
      simulateGeoDataStream,
    } = this.state;

    const {
      t,
    } = this.props;
    return (
      <Dropdown.Item as="button" onClick={this.switchMovementMode}>
        <Form.Check
          type="switch"
          id="movementSimulatorSwitch"
          label={t('simulateMovement')}
          checked={simulateGeoDataStream}
          className="py-3 text-xl"
        />
      </Dropdown.Item>
    );
  }

  toDefaultImageUrl = () => this.setImageUrl(defaultImgUrl);

  prepareDataForJson() {
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

  downloadDatabaseAsFile() {
    json2File(this.prepareDataForJson(), makeFileName('SR_acoustic_poc', 'json', new Date()));
  }

  // eslint-disable-next-line class-methods-use-this
  uploadDatabaseFile(evt) {
    const input = evt.target.querySelector('input');
    if (input) {
      input.value = '';
      input.click();
    }
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
      dataService, spiritService, soundService, simulateGeoDataStream, curPosition, waitingForGeolocation, gameModel,
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
                <header className="flex-0-0-auto">
                  <Navbar expand="md" className="view-switch pb-0">

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                      <Nav as="ul">
                        {
                          navLinks.map((navLink) => (
                            <Nav.Item as="li" key={navLink.to}>
                              <NavLink className="px-3 py-2 text-xl" to={navLink.to}>{t(navLink.tKey)}</NavLink>
                            </Nav.Item>
                          ))
                        }
                        <Dropdown as="li">
                          <Dropdown.Toggle as="a" className="px-3 py-2 text-xl" href="#">{t('prevPrototypes')}</Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/* as="ul" */}
                            {
                              oldNavLinks.map((navLink) => (
                                <Nav.Item as="li" key={navLink.to}>
                                  <NavLink className="px-3 py-2 text-xl" to={navLink.to}>{t(navLink.tKey)}</NavLink>
                                </Nav.Item>
                              ))
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                      </Nav>
                    </Navbar.Collapse>
                    
                    <ModelRunControl gameModel={gameModel} />
                    <Dropdown as={Nav.Item} alignRight>
                      <Dropdown.Toggle as={Nav.Link} className="text-xl">{t('actionMenu')}</Dropdown.Toggle>
                      <Dropdown.Menu style={{ zIndex: 2000 }}>
                        {
                          this.getUploadButton()
                        }
                        {
                          this.getDownloadButton()
                        }
                        <Dropdown.Divider />
                        {
                          this.getJumpToUserCoordsSwitch()
                        }

                        {
                          this.getMovementSimulatorSwitch()
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Navbar>
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
                      <Map2
                        dataService={dataService}
                        soundService={soundService}
                        simulateGeoDataStream={simulateGeoDataStream}
                        curPosition={curPosition}
                        gameModel={gameModel}
                      />
                    </Route>
                    <Route path="/spiritEditor">
                      <SpiritEditor spiritService={spiritService} />
                    </Route>
                    <Route path="/soundManager2">
                      <SoundManager soundService={soundService} />
                    </Route>

                    <Route render={() => <Redirect to="/soundManager2" />} />
                    {/* <Route render={() => <Redirect to="/map2" />} /> */}
                  </Switch>
                </main>
              </div>
            </Router>
          </DocumentTitle>
        </ErrorBoundry>
      </React.StrictMode>

    );
  }
}
