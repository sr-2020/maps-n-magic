import React, { Component } from 'react';
import './SpiritContent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import Form from 'react-bootstrap/Form';
import DocumentTitle from 'react-document-title';
import { SpiritContentPropTypes } from '../../../types';

import { InPlaceInput } from '../InPlaceInput';

import { AbilitiesInput } from './AbilitiesInput';


export class SpiritContent extends Component {
  static propTypes = SpiritContentPropTypes;

  constructor(props) {
    super(props);
    const {
      id, spiritService,
    } = props;
    this.state = this._getNewState(id, spiritService);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount = () => {
    console.log('SpiritContent mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.id === this.props.id) {
      return;
    }
    const {
      id, spiritService,
    } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState(this._getNewState(id, spiritService));
    // this.getStateInfo();
    // console.log('SpiritContent did update');
  }

  _getNewState = (id, spiritService) => ({
    ...spiritService.getSpirit(id),
  })

  componentWillUnmount = () => {
    console.log('SpiritContent will unmount');
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const { id, spiritService } = this.props;

    spiritService.putSpirit(id, {
      [name]: value,
    });

    this.setState({
      [name]: value,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    // id: number.isRequired,
    // name: string.isRequired,
    // aura: string.isRequired,
    // fraction: string.isRequired,
    // story: string.isRequired,
    // abilities: arrayOf(string).isRequired,

    // latLng: latLngPropTypes.isRequired,
    // plane: planePropTypes.isRequired,
    // hitPoints: number.isRequired,

    const {
      name, aura, fraction, story, abilities, latLng, plane, hitPoints,
    } = this.state;
    const { spiritService, id } = this.props;

    if (!id) {
      return (
        <div className="SpiritContent flex-grow">
          You have no spirits
        </div>
      );
    }

    return (
      <DocumentTitle title={name}>

        <div className="SpiritContent flex-grow px-16 py-8 overflow-auto">
          <div className="SpiritContentWorkspace">
            <h2 className="mb-8 w-50p">
              <Form.Control
                name="name"
                type="text"
                className="text-3xl"
                value={name}
                onChange={this.handleInputChange}
              />
            </h2>

            <div className="table">
              <div className="table-column w-1_6p" />
              {/* <h3 className="table-caption">Spirit info</h3> */}
              {/* <div className="table-row">
                <div className="table-cell">Aura</div>
                <div className="table-cell">
                  {aura}
                </div>
              </div> */}
              <div className="table-row">
                <div className="table-cell">fraction</div>
                <div className="table-cell">
                  <Form.Control
                    name="fraction"
                    type="text"
                    className="w-50p"
                    value={fraction}
                    onChange={this.handleInputChange}
                    list="fraction-datalist"
                  />
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">story</div>
                <div className="table-cell">
                  <Form.Control
                    name="story"
                    as="textarea"
                    rows="3"
                    value={story}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">abilities</div>
                {/* <div className="table-cell">{abilities.join(', ') || 'None'}</div> */}
                <div className="table-cell">
                  <AbilitiesInput
                    spiritService={spiritService}
                    id={id}
                  />
                </div>
              </div>
            </div>


            {/* <div className="table">
              <div className="table-column w-24" />
              <h3 className="table-caption">Current spirit status</h3>
              <div className="table-row h-8">
                <div className="table-cell">Position</div>
                <div className="table-cell">{`To be done ${JSON.stringify(latLng)}`}</div>
              </div>
              <div className="table-row h-8">
                <div className="table-cell">Plane</div>
                <div className="table-cell">{`To be done ${plane}`}</div>
              </div>
              <div className="table-row h-8">
                <div className="table-cell">Hit Points</div>
                <div className="table-cell">{`To be done ${hitPoints}`}</div>
              </div>
            </div> */}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}
