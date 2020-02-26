import React from 'react';
import './TrackAnalysisNav.css';

import {
  BrowserRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

const navLinks = [{
  to: '/realTrackStats',
  tKey: 'realTrackStats',
}, {
  to: '/trackDemo',
  tKey: 'trackDemo',
}, {
  to: '/userTrackAnalysis',
  tKey: 'userTrackAnalysis',
}, {
  to: '/backgroundEditorMap',
  tKey: 'backgroundEditorMap',
}];

// import { TrackAnalysisNavPropTypes } from '../../types';

export function TrackAnalysisNav(props) {
  const { t } = props;

  return (
    <Nav as="ul" className="TrackAnalysisNav flex-col mx-8 my-4">
      {
        navLinks.map((navLink) => (
          <Nav.Item as="li" key={navLink.to} className="mb-5">
            <NavLink
              className="px-3 py-3 text-lg bg-gray-300"
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
  );
}

// TrackAnalysisNav.propTypes = TrackAnalysisNavPropTypes;
