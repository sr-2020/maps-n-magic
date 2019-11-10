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


// import Form from 'react-jsonschema-form';
// import { SpiritList } from './SpiritList/SpiritList';

// const schema = {
//   title: 'Edit spirit',
//   type: 'object',
//   required: [],
//   properties: {
//     name: { type: 'string', title: 'Name', default: '' },
//     story: { type: 'string', title: 'Story', default: '' },
//     fraction: { type: 'string', title: 'Story', default: '' },
//     aura: { type: 'string', title: 'Story', default: '' },
//     abilities: { type: 'string', title: 'Story', default: '' },

//     itinerary: {},
//     // latitude: { type: 'number', title: 'Latitude', default: 0 },
//     // longitude: { type: 'number', title: 'Longitude', default: 0 },
//   },
// };

// state
// latLng
// plane
// relation to ...
// hitPoints

// isInControl (?)

// const uiSchema = {
//   description: {
//     'ui:widget': 'textarea',
//     // classNames: "foo"
//   },
// };
// const schema = {
//   title: 'Edit marker',
//   type: 'object',
//   required: [],
//   properties: {
//     name: { type: 'string', title: 'Name', default: '' },
//     latitude: { type: 'number', title: 'Latitude', default: 0 },
//     longitude: { type: 'number', title: 'Longitude', default: 0 },
//   },
// };


// const schema = {
//   title: 'Todo',
//   type: 'object',
//   required: ['title'],
//   properties: {
//     title: { type: 'string', title: 'Title', default: 'A new task' },
//     done: { type: 'boolean', title: 'Done?', default: false },
//   },
// };

// const formData = {
//   title: 'First task',
//   done: true,
// };

// const log = (type) => console.log.bind(console, type);

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
