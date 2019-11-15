import React, { Component } from 'react';
import './SpiritEditor.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import * as R from 'ramda';

import {
  NavLink, Route, Redirect,
} from 'react-router-dom';
import { SpiritEditorPropTypes } from '../../types';

import { SpiritList } from './SpiritList';
import { SpiritContent } from './SpiritContent';
import { FractionList } from './FractionList';

export class SpiritEditor extends Component {
  static propTypes = SpiritEditorPropTypes;

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount = () => {
    console.log('SpiritEditor mounted');
  }

  componentDidUpdate = () => {
    console.log('SpiritEditor did update');
  }

  componentWillUnmount = () => {
    console.log('SpiritEditor will unmount');
  }


  // eslint-disable-next-line max-lines-per-function
  render() {
    const { spiritService } = this.props;

    return (
      <div className="SpiritEditor h-full flex">
        <SpiritList spiritService={spiritService} />
        <Route
          path="/spiritEditor/:id"
          render={({ match }) => {
            const { id } = match.params;

            return (
              <SpiritContent
                id={Number(id)}
                spiritService={spiritService}
                spiritTmp={spiritService.getSpirit(Number(id))}
              />
            );
          }}
        />
        <FractionList spiritService={spiritService} />
      </div>
    );
  }
}
