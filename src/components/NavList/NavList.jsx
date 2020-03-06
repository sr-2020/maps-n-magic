import React from 'react';
import './NavList.css';

import {
  BrowserRouter as Router, Switch, Route, Redirect, NavLink,
} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import classNames from 'classnames';

// import { NavListPropTypes } from '../../types';

export function NavList(props) {
  const { t, navLinks, className } = props;

  return (
    <Nav as="ul" className={classNames(className, 'NavList flex-col')}>
      {
        navLinks.map((navLink) => (
          <Nav.Item as="li" key={navLink.to} className="mb-3 flex">
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
    </Nav>
  );
}

// NavList.propTypes = NavListPropTypes;
