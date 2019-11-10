import React, { Component } from 'react';
import './SpiritContent.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { SpiritContentPropTypes } from '../../../types';

import { InPlaceInput } from '../InPlaceInput';

export class SpiritContent extends Component {
  static propTypes = SpiritContentPropTypes;

  constructor(props) {
    super(props);
    const {
      id, spiritService,
    } = props;
    this.state = this._getNewState(id, spiritService);
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
      id, name, aura, fraction, story, abilities, latLng, plane, hitPoints,
    } = this.state;
    const { spiritTmp } = this.props;

    if (!id) {
      return (
        <div className="SpiritContent flex-grow">
          You have no spirits
        </div>
      );
    }

    return (
      <div className="SpiritContent flex-grow px-16 py-8">

        <h2 className="mb-8">
          <InPlaceInput value={name} />
        </h2>

        <div className="table">
          <div className="table-column w-24" />
          <h3 className="table-caption">Spirit info</h3>
          <div className="table-row h-8">
            <div className="table-cell">Aura</div>
            <div className="table-cell">{aura || 'None'}</div>
          </div>
          <div className="table-row h-8">
            <div className="table-cell">fraction</div>
            <div className="table-cell">{fraction || 'None'}</div>
          </div>
          <div className="table-row h-8">
            <div className="table-cell">story</div>
            <div className="table-cell">{story || 'None'}</div>
          </div>
          <div className="table-row h-8">
            <div className="table-cell">abilities</div>
            <div className="table-cell">{abilities.join(', ') || 'None'}</div>
          </div>
        </div>


        <div className="table">
          <div className="table-column w-24" />
          <h3 className="table-caption">Current spirit status</h3>
          <div className="table-row h-8">
            <div className="table-cell">Position</div>
            <div className="table-cell">{latLng.toString()}</div>
          </div>
          <div className="table-row h-8">
            <div className="table-cell">Plane</div>
            <div className="table-cell">{plane}</div>
          </div>
          <div className="table-row h-8">
            <div className="table-cell">Hit Points</div>
            <div className="table-cell">{hitPoints}</div>
          </div>
        </div>
      </div>
    );
  }
}
