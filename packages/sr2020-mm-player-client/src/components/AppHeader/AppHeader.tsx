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
import Form from "react-bootstrap/Form";

import { LinkContainer } from 'react-router-bootstrap'

import { logoutUser, callSecureApi, refreshCharacterModel } from "../../api";
import { LoginManager } from '../../utils';
import { AggregatedLocationView, CharacterModelData2 } from 'sr2020-mm-event-engine';

interface AppHeaderProps {
  loginManager: LoginManager;
  title: string;
  locationData: AggregatedLocationView | null;
  characterData: CharacterModelData2;
  mute: boolean;
  setMute: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader(props: AppHeaderProps) {
  const { loginManager, title, locationData, characterData, mute, setMute } = props;

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
            <Nav.Link>Поймать духа</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/scanSpirit">
            <Nav.Link>Осмотреть тотем</Nav.Link>
          </LinkContainer>
          {
            characterData.spiritSuitState === undefined && 
            <LinkContainer to="/suitSpirit">
              <Nav.Link>Надеть духа</Nav.Link>
            </LinkContainer>
          }
          {
            characterData.spiritSuitState !== undefined && 
            <>
              <LinkContainer to="/dispirit">
                <Nav.Link>Снять духа</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/emergencyDispirit">
                <Nav.Link>Экстренно снять духа</Nav.Link>
              </LinkContainer>
            </>
          }
          {/* <LinkContainer to="/qrTest">
            <Nav.Link>QR тест</Nav.Link>
          </LinkContainer> */}
        </Nav>
      </Navbar.Collapse>

      <Dropdown as={Nav.Item} alignRight>
        <Dropdown.Toggle className="sr2020-right-dropdown tw-text-2xl navbar-toggler tw-py-2">
          <FontAwesomeIcon icon={faEllipsisV} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ zIndex: 2000 }}>
          <Dropdown.Header>{`#${characterData.workModel.modelId}`}</Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item as="button" onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log('mute change', !mute) 
            setMute(!mute)
          }}>
            <Form.Check
              type="switch"
              id="soundSwitch"
              label="Выключить звук"
              checked={mute}
              className="tw-py-3 tw-text-lg"
            />
          </Dropdown.Item>
          {/* <Dropdown.Item
            as="button"
            type="button"
            onClick={() => loginManager.updateLoginState()}
            title="Обновить данные персонажа"
            className="tw-py-3 tw-text-lg"
          >
            Обновить данные персонажа
          </Dropdown.Item> */}
          {/* <Dropdown.Item
            as="button"
            type="button"
            onClick={callSecureApi}
            title="Запрос на защищенный эндпоинт"
            className="tw-py-3 tw-text-lg"
          >
            Запрос на защищенный эндпоинт
          </Dropdown.Item> */}
          <Dropdown.Item
            as="button"
            type="button"
            onClick={refreshCharacterModel}
            title="Выйти"
            className="tw-py-3 tw-text-lg"
          >
            Обновить данные персонажа
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



