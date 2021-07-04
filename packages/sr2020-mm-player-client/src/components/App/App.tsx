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

import { LinkContainer } from 'react-router-bootstrap'

import { ErrorBoundry } from "../ErrorBoundry";
import { BrowserRouter, Route, Switch, Redirect, NavLink } from 'react-router-dom';

import { LoginManager } from "../../utils";
import { LoginState } from "../../types";
import { WithLoginState, WithAggregatedLocationData } from '../../hocs';
import { LoginPage } from '../LoginPage';
import { logoutUser, callSecureApi } from "../../api";
import { SpiritList } from "../SpiritList";
import { QrTest } from "../QrTest";
import { SpiritPage } from "../SpiritPage";
import { SuitSpiritPage } from "../SuitSpiritPage";

interface AppProps extends WithLoginState, WithAggregatedLocationData {
  loginManager: LoginManager;
}

export function App(props: AppProps) {
  const { loginState, loginManager, locationData } = props;
  const manageTitle = useState<string>('SR 2020 магия');
  const [title, setTitle] = manageTitle;

  const onLogout = async () => {
    // event.preventDefault();
    await logoutUser();
    loginManager.updateLoginState(true);
  }
  
  return (
    <DocumentTitle title={title}>
      <BrowserRouter>
        <div className="App">
          <Navbar 
            collapseOnSelect 
            expand={false} 
            variant="dark" 
            className="tw-bg-green-800"
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
                <LinkContainer to="/spirits">
                  <Nav.Link>Духи</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/scanSpirit">
                  <Nav.Link>Осмотреть духа</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/suitSpirit">
                  <Nav.Link>Надеть духа</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/qrTest">
                  <Nav.Link>QR тест</Nav.Link>
                </LinkContainer>
                {/* <NavLink to="/spirits" className="nav-link">Духи</NavLink>
                <NavLink to="/scanSpirit" className="nav-link">Осмотреть/Надеть духа</NavLink>
                <Nav.Link href="#features">Духи</Nav.Link> */}
                {/* <Nav.Link href="#pricing"> духа</Nav.Link> */}
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
        {/* <h1>Application</h1>
        {JSON.stringify(locationData)} */}
        
          <Switch>
            <Route path="/spirits">
              <SpiritList 
                setTitle={setTitle}
                locationData={locationData}
              />
            </Route>
            <Route path="/scanSpirit">
              <SpiritPage />
            </Route>
            <Route path="/suitSpirit">
              <SuitSpiritPage />
            </Route>
            <Route path="/qrTest">
              <QrTest />
            </Route>
            <Route path="/">
              {/* <Redirect to="/spirits" /> */}
              <Redirect to="/suitSpirit" />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </DocumentTitle>
  );
}


