import React, { Component } from 'react';
import './AppHeader.css';

import {
  BrowserRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import Dropdown from 'react-bootstrap/Dropdown';
import { ModelRunControl } from '../../ModelRunControl';

import { DownloadDatabaseButton } from '../DownloadDatabaseButton';
import { UploadDatabaseButton } from '../UploadDatabaseButton';
import { JumpToUserCoordsSwitch } from '../JumpToUserCoordsSwitch';
import { MovementSimulatorSwitch } from '../MovementSimulatorSwitch';
import { ModelRunSelector } from '../ModelRunSelector';


// import { AppHeaderPropTypes } from '../../types';

// const oldNavLinks = [{
//   to: '/mapEditor',
//   tKey: 'mapEditor',
// }, {
//   to: '/beacons',
//   tKey: 'beacons',
// }, {
//   to: '/soundManager',
//   tKey: 'soundManager',
// }, {
//   to: '/demo',
//   tKey: 'demo',
// }];


const navLinks = [{
  to: '/map2',
  tKey: 'map2',
}, {
  to: '/spiritEditor',
  tKey: 'spiritEditor',
}, {
  to: '/soundManager2',
  tKey: 'soundManager2',
}, {
  to: '/soundMapping',
  tKey: 'soundMapping',
}];

export class AppHeader extends Component {
  // static propTypes = AppHeaderPropTypes;

  constructor() {
    super();
    this.state = {
      // expanded: false,
    };
    // this.onToggle = this.onToggle.bind(this);
  }

  componentDidMount = () => {
    console.log('AppHeader mounted');
  }

  componentDidUpdate = () => {
    console.log('AppHeader did update');
  }

  componentWillUnmount = () => {
    console.log('AppHeader will unmount');
  }

  // onToggle() {
  //   this.setState(({ expanded }) => this.setState({ expanded: !expanded }));
  // }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { expanded } = this.state;
    const {
      t, gameModel, waitingForGeolocation, curPosition, simulateGeoDataStream,
      onUploadFileSelected, downloadDatabaseAsFile, jumpToUserCoords, switchMovementMode,
    } = this.props;

    // if (!something) {
    //   return <div> AppHeader stub </div>;
    //   // return null;
    // }
    return (
      <header className="AppHeader flex-0-0-auto">
        <Navbar
          expand="md"
          className="view-switch pb-0"
          // collapseOnSelect
          // expanded={expanded}
          // onToggle={this.onToggle}
        >

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav as="ul">
              {
                navLinks.map((navLink) => (
                  <Nav.Item as="li" key={navLink.to}>
                    <NavLink
                      className="px-3 py-2 text-lg"
                      to={navLink.to}
                      // onClick={this.onToggle}
                    >
                      {t(navLink.tKey)}
                    </NavLink>
                  </Nav.Item>
                ))
              }
              {/* <Dropdown as="li">
                <Dropdown.Toggle as="a" className="px-3 py-2 text-xl" href="#">{t('prevPrototypes')}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    oldNavLinks.map((navLink) => (
                      <Nav.Item as="li" key={navLink.to}>
                        <NavLink className="px-3 py-2 text-xl" to={navLink.to}>{t(navLink.tKey)}</NavLink>
                      </Nav.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown> */}
            </Nav>
          </Navbar.Collapse>

          {/* <ModelRunControl gameModel={gameModel} /> */}
          <Dropdown as={Nav.Item} alignRight>
            <Dropdown.Toggle as={Nav.Link} className="text-lg">{t('actionMenu')}</Dropdown.Toggle>
            <Dropdown.Menu style={{ zIndex: 2000 }}>
              <UploadDatabaseButton onChange={onUploadFileSelected} />
              <DownloadDatabaseButton onClick={downloadDatabaseAsFile} />
              <Dropdown.Divider />
              <JumpToUserCoordsSwitch
                onClick={jumpToUserCoords}
                waitingForGeolocation={waitingForGeolocation}
                curPosition={curPosition}
              />
              <MovementSimulatorSwitch
                onClick={switchMovementMode}
                simulateGeoDataStream={simulateGeoDataStream}
              />
              <Dropdown.Divider />
              <ModelRunSelector gameModel={gameModel} />
            </Dropdown.Menu>
          </Dropdown>
        </Navbar>
      </header>
    );
  }
}
