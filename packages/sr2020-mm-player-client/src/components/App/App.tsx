import React, { Component, useState, useEffect, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

import './App.css';

import DocumentTitle from 'react-document-title';

import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

import { ErrorBoundry } from "../ErrorBoundry";
// import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LoginManager } from "../../utils";
import { LoginState } from "../../types";
import { WithLoginState, WithAggregatedLocationData } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { logoutUser, callSecureApi } from "../../api";

interface AppProps extends WithLoginState, WithAggregatedLocationData {
  loginManager: LoginManager;
}

export function App(props: AppProps) {
  const { loginState, loginManager, locationData } = props;

  const onLogout = async () => {
    // event.preventDefault();
    await logoutUser();
    loginManager.updateLoginState();
  }
  
  return (
    <DocumentTitle title="Приложение">
      {/* <MapDefaultsProvider value={mapDefaults}> */}
        <div className="App">
          <Navbar collapseOnSelect expand={false} variant="dark" className="tw-bg-green-800">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand className="tw-inline-flex tw-flex-col">
              <span>Страница</span>
              <span className="tw-text-sm">
              {
                locationData === null ? "Локация неизвестна" : (locationData.label)
              }
              </span>
            </Navbar.Brand>
            {/* <div>123</div> */}
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#features">Духи</Nav.Link>
                <Nav.Link href="#pricing">Надеть духа</Nav.Link>
                <Nav.Link href="#pricing">Осмотреть духа</Nav.Link>
                {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
              {/* <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  Dank memes
                </Nav.Link>
              </Nav> */}
            </Navbar.Collapse>

            <Dropdown as={Nav.Item} alignRight>
              <Dropdown.Toggle className="sr2020-right-dropdown tw-text-2xl navbar-toggler tw-py-2">
                <FontAwesomeIcon icon={faEllipsisV} />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ zIndex: 2000 }}>
                <Dropdown.Header>Заголовок меню</Dropdown.Header>
                <Dropdown.Divider />
                {/* <Dropdown.Item as="button"
                >
                  <Form.Check
                    type="switch"
                    id="manaOceanSwitch"
                    label={'calcManaOcean'}
                    className="tw-py-3 tw-text-lg"
                  />
                </Dropdown.Item> */}
                <Dropdown.Item
                  as="button"
                  type="button"
                  onClick={loginManager.updateLoginState}
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
          <h1>Application</h1>
          {/* <BrowserRouter>
            <Switch>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/preferences">
                <Preferences />
              </Route>
            </Switch>
          </BrowserRouter> */}
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header> */}
        </div>
      {/* </MapDefaultsProvider> */}
    </DocumentTitle>
  );
}


