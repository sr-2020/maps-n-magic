import React, { Component } from 'react';
import './AppHeader.css';

import {
  NavLink, Route,
} from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import Dropdown from 'react-bootstrap/Dropdown';
import { WithTranslation } from 'react-i18next';
import { GameModel } from "sr2020-mm-event-engine";
import { NavLinkData } from "sr2020-mm-client-core";
// import { ModelRunControl } from '../../ModelRunControl';

import { TFunction } from 'react-i18next';

// import { DownloadDatabaseButton } from '../DownloadDatabaseButton';
// import { UploadDatabaseButton } from '../UploadDatabaseButton';
// import { JumpToUserCoordsSwitch } from '../JumpToUserCoordsSwitch';
// import { MovementSimulatorSwitch } from '../MovementSimulatorSwitch';
import { ManaOceanSwitch } from '../ManaOceanSwitch';
import { SpiritMovementSwitch } from '../SpiritMovementSwitch';
// import { ModelRunSelector } from '../ModelRunSelector';
import { WipeManaOceanEffectsButton } from '../WipeManaOceanEffectsButton';
import { LoginManager } from "../../../utils";
import { logoutUser } from '../../../api';

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

const navLinks: NavLinkData[] = [{
  to: '/mapsNav',
  tKey: 'mapsNav',
}, {
  to: '/spiritNav',
  tKey: 'spiritNav',
}, {
//   to: '/spiritEditor',
//   tKey: 'spiritEditor',
// }, {
//   to: '/soundManager2',
//   tKey: 'soundManager2',
// }, {
//   to: '/soundMapping',
//   tKey: 'soundMapping',
// }, {
//   to: '/trackAnalysis/index.html',
//   tKey: 'trackAnalysisNav',
//   rawLink: true,
// }, {
  to: '/beaconRecordEditor',
  tKey: 'beaconRecordEditor',
}];

interface AppHeaderProps extends WithTranslation {
  simulateGeoDataStream: boolean;
  waitingForGeolocation: boolean;
  gameModel: GameModel;
  // onUploadFileSelected: any;
  // downloadDatabaseAsFile: any;
  jumpToUserCoords: (e: React.MouseEvent<HTMLElement>) => void;
  switchMovementMode: (e: React.MouseEvent<HTMLElement>) => void;
  loginManager: LoginManager;
};

function getLink (t: TFunction, navLink: NavLinkData) {
  if (navLink.rawLink) {
    return (
      <a
        className="tw-px-3 tw-py-2 tw-text-lg"
        href={navLink.to}
      >
        {t(navLink.tKey)}
      </a>
    );
  }
  return (
    <NavLink
      className="tw-px-3 tw-py-2 tw-text-lg"
      to={navLink.to}
    >
      {t(navLink.tKey)}
    </NavLink>
  );
}

export function AppHeader(props: AppHeaderProps) {
  const {
    t, gameModel, waitingForGeolocation, simulateGeoDataStream,
    jumpToUserCoords, switchMovementMode, loginManager
  } = props;

  const onLogout = async () => {
    // event.preventDefault();
    await logoutUser();
    loginManager.updateLoginState(true);
  }
  
  return (
    <header className="AppHeader flex-0-0-auto">
      <Navbar
        expand="md"
        className="view-switch tw-pb-0"
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
                  {getLink(t, navLink)}
                </Nav.Item>
              ))
            }
            {/* <Dropdown as="li">
              <Dropdown.Toggle as="a" className="tw-px-3 tw-py-2 tw-text-xl" href="#">{t('prevPrototypes')}</Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  oldNavLinks.map((navLink) => (
                    <Nav.Item as="li" key={navLink.to}>
                      <NavLink className="tw-px-3 tw-py-2 tw-text-xl" to={navLink.to}>{t(navLink.tKey)}</NavLink>
                    </Nav.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown> */}
          </Nav>
        </Navbar.Collapse>
  
        {/* <ModelRunControl gameModel={gameModel} /> */}
        <Dropdown as={Nav.Item} alignRight>
          <Dropdown.Toggle as={Nav.Link} className="tw-text-lg">{t('actionMenu')}</Dropdown.Toggle>
          <Dropdown.Menu style={{ zIndex: 2000 }}>
            {/* <UploadDatabaseButton onChange={onUploadFileSelected} />
            <DownloadDatabaseButton onClick={downloadDatabaseAsFile} /> */}
            <Dropdown.Divider />
            {/* <JumpToUserCoordsSwitch
              onClick={jumpToUserCoords}
              waitingForGeolocation={waitingForGeolocation}
            />
            <MovementSimulatorSwitch
              onClick={switchMovementMode}
              simulateGeoDataStream={simulateGeoDataStream}
            /> */}
            <ManaOceanSwitch
              gameModel={gameModel}
            />
            <SpiritMovementSwitch
              gameModel={gameModel}
            />
            <WipeManaOceanEffectsButton
              gameModel={gameModel}
            />
            <Dropdown.Divider />
            {/* <Dropdown.Divider />
            <Route path="/map2">
              <ModelRunSelector gameModel={gameModel} />
            </Route> */}
            <Dropdown.Item
              as="button"
              type="button"
              onClick={onLogout}
              title="Выйти"
              className="tw-py-3 tw-text-lg"
            >
              Выйти
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </header>
  );
}

