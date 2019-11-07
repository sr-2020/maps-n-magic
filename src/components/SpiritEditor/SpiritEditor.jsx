import React, { Component } from 'react';
import './SpiritEditor.css';

// import { SpiritEditorPropTypes } from '../../types';

import Form from 'react-jsonschema-form';

const schema = {
  title: 'Edit spirit',
  type: 'object',
  required: [],
  properties: {
    name: { type: 'string', title: 'Name', default: '' },
    story: { type: 'string', title: 'Story', default: '' },
    fraction: { type: 'string', title: 'Story', default: '' },
    aura: { type: 'string', title: 'Story', default: '' },
    abilities: { type: 'string', title: 'Story', default: '' },

    itinerary: {},
    // latitude: { type: 'number', title: 'Latitude', default: 0 },
    // longitude: { type: 'number', title: 'Longitude', default: 0 },
  },
};

// state
// latLng
// plane
// relation to ...
// hitPoints
// isInControl (?)

const uiSchema = {
  description: {
    'ui:widget': 'textarea',
    // classNames: "foo"
  },
};
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

const log = (type) => console.log.bind(console, type);

export class SpiritEditor extends Component {
  // static propTypes = SpiritEditorPropTypes;

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

  render() {
    const { something } = this.state;
    // const { t } = this.props;

    // if (!something) {
    //   return <div> SpiritEditor stub </div>;
    //   // return null;
    // }
    return (
      <div className="SpiritEditor">
        SpiritEditor body
        <Form
          schema={schema}
          // uiSchema={uiSchema}
          // formData={formData}
          onChange={log('changed')}
          onSubmit={log('submitted')}
          onError={log('errors')}
        />
      </div>
    );
  }
}
