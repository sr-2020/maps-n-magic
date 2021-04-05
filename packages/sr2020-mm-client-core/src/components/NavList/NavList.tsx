import React from 'react';
import './NavList.css';

import {
  NavLink,
} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import classNames from 'classnames';
import { WithTranslation, TFunction } from 'react-i18next';
import { NavLinkData } from "../../types";

interface NavListProps extends WithTranslation {
  className?: string;
  navLinks: NavLinkData[];
}

export function NavList(props: NavListProps) {
  const { t, navLinks, className } = props;

  return (
    <Nav as="ul" className={classNames(className, 'NavList tw-flex-col')}>
      {
        navLinks.map((navLink) => (
          <Nav.Item as="li" key={navLink.to} className="tw-mb-3 tw-flex">
            <NavLink
              className="tw-px-3 tw-py-3 tw-text-lg tw-bg-gray-300"
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
