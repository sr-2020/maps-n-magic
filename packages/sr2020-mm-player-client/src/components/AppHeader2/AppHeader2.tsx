import React from 'react';
import { AggregatedLocationView, CharacterModelData2 } from 'sr2020-mm-event-engine';
import { logoutUser, refreshCharacterModel } from '../../api';
import { LoginManager, dictionary } from '../../utils';
import './AppHeader2.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV, faBars
} from '@fortawesome/free-solid-svg-icons';

import { LinkContainer } from 'react-router-bootstrap';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { LinkDef } from '../../types';


interface AppHeader2Props  {
  loginManager: LoginManager;
  title: string;
  locationData: AggregatedLocationView | null;
  characterData: CharacterModelData2;
  mute: boolean;
  setMute: React.Dispatch<React.SetStateAction<boolean>>;
  links: LinkDef[];
}

export function AppHeader2(props: AppHeader2Props) {
  const { loginManager, title, locationData, characterData, mute, setMute, links } = props;

  const onLogout = async () => {
    await logoutUser();
    loginManager.updateLoginState(true);
  }


  return (
    <nav className="AppHeader2 tw-bg-green-800 navbar navbar-dark sticky-top">
      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle className="sr2020-right-dropdown tw-text-2xl navbar-toggler tw-py-2">
          <FontAwesomeIcon icon={faBars} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ zIndex: 2000 }}>
          {
            links.map(linkDef => 
              <LinkContainer to={linkDef.to}>
                <Nav.Link className="dropdown-item tw-py-3 tw-text-lg">{linkDef.label}</Nav.Link>
              </LinkContainer>
            )
          }
        </Dropdown.Menu>
      </Dropdown>
      
      <span className="tw-inline-flex tw-flex-col navbar-brand">
        <span>{title}</span>
        <span className="tw-text-sm">
        {
          locationData === null ? dictionary.locationIsUnknown : (locationData.label)
        }
        </span>
      </span>
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
              label={dictionary.mute}
              checked={mute}
              className="tw-py-3 tw-text-lg"
            />
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            type="button"
            onClick={refreshCharacterModel}
            title={dictionary.updateCharacterData}
            className="tw-py-3 tw-text-lg"
          >
            {dictionary.updateCharacterData}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            as="button"
            type="button"
            onClick={onLogout}
            title={dictionary.logout}
            className="tw-py-3 tw-text-lg"
          >
            {dictionary.logout}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
}



