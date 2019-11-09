import React, { Component } from 'react';
import './SpiritEditor.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { SpiritEditorPropTypes } from '../../types';


// import Form from 'react-jsonschema-form';

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

  static getSpiritList() {
    const arr = ['Иркут', 'Ангара', 'Байкал', 'Баргузин'];
    return [...arr, ...arr, ...arr].map((spirit) => (
      <li className="SpiritListItem relative">
        <a
          href="#"
          className="
            px-3
            py-2
            block
            text-gray-900
            hover:text-gray-900
            no-underline
            hover:no-underline
            focus:outline-none
            focus:shadow-outline
            hover:bg-indigo-200
            active:bg-indigo-600
          "
        >
          <div className="menu float-right">
            <button
              type="button"
              className="
                SpiritMenuButton
                w-8
                h-8
                hover:bg-indigo-300
                active:bg-indigo-600
                focus:outline-none
                focus:shadow-outline
                active:bg-indigo-600
                opacity-0
                hover:opacity-100
                focus:opacity-100
              "
            >
              <FontAwesomeIcon icon={faEllipsisH} />
            </button>
          </div>
          <div className="body">
            <div className="spirit-name font-bold text-sm">{spirit}</div>
            <div className="spirit-fraction text-sm">spiri</div>


          </div>
        </a>
      </li>
    ));
  }

  render() {
    const { something } = this.state;
    // const { t } = this.props;

    // if (!something) {
    //   return <div> SpiritEditor stub </div>;
    //   // return null;
    // }
    return (
      <div className="SpiritEditor h-full flex">
        <div className="SpiritList flex-grow-0 flex flex-col">
          <div className="bg-blue-300 flex-grow-0 text-right px-3 py-2">
            <button type="button" className="tw-btn tw-btn-blue">
              <FontAwesomeIcon className="fill-current w-4 h-4 mr-2" icon={faPlus} />
              <span>New Spirit</span>
            </button>
          </div>
          <div className="bg-orange-300 flex-grow overflow-auto">
            <ul>
              {
                SpiritEditor.getSpiritList()
              }
            </ul>
          </div>
        </div>
        <div className="bg-green-300 flex-grow">
          content
        </div>
        {/* SpiritEditor body */}
        {/* <Form
          schema={schema}
          // uiSchema={uiSchema}
          // formData={formData}
          onChange={log('changed')}
          onSubmit={log('submitted')}
          onError={log('errors')}
        /> */}
      </div>
    );
  }
}
