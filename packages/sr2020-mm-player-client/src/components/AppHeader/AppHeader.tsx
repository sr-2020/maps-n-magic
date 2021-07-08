import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import './AppHeader.css';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";

import { LinkContainer } from 'react-router-bootstrap'

import { logoutUser, callSecureApi } from "../../api";
import { LoginManager } from '../../utils';
import { AggregatedLocationView } from 'sr2020-mm-event-engine';

interface AppHeaderProps {
  loginManager: LoginManager;
  title: string;
  locationData: AggregatedLocationView | null;
}

export function AppHeader(props: AppHeaderProps) {
  const { loginManager, title, locationData } = props;

  const onLogout = async () => {
    await logoutUser();
    loginManager.updateLoginState(true);
  }

  return (
    <Navbar 
      collapseOnSelect 
      expand={false} 
      variant="dark" 
      className="AppHeader tw-bg-green-800"
      sticky="top"
    >
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Brand className="tw-inline-flex tw-flex-col">
        <span>{title}</span>
        <span className="tw-text-sm">
        {
          locationData === null ? "Локация неизвестна" : (locationData.label)
        }
        </span>
      </Navbar.Brand>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/character">
            <Nav.Link>Персонаж</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/spirits">
            <Nav.Link>Духи</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/scanSpirit">
            <Nav.Link>Осмотреть тотем</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/suitSpirit">
            <Nav.Link>Надеть духа</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/qrTest">
            <Nav.Link>QR тест</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>

      <Dropdown as={Nav.Item} alignRight>
        <Dropdown.Toggle className="sr2020-right-dropdown tw-text-2xl navbar-toggler tw-py-2">
          <FontAwesomeIcon icon={faEllipsisV} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ zIndex: 2000 }}>
          <Dropdown.Header>Заголовок меню</Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item
            as="button"
            type="button"
            onClick={() => loginManager.updateLoginState()}
            title="Обновить данные персонажа"
            className="tw-py-3 tw-text-lg"
          >
            Обновить данные персонажа
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            type="button"
            onClick={callSecureApi}
            title="Запрос на защищенный эндпоинт"
            className="tw-py-3 tw-text-lg"
          >
            Запрос на защищенный эндпоинт
          </Dropdown.Item>
          <Dropdown.Divider />
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
  );
}



