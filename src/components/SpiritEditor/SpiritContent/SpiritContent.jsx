import React, { Component } from 'react';
import './SpiritContent.css';

import Form from 'react-bootstrap/Form';
import DocumentTitle from 'react-document-title';
import { SpiritContentPropTypes } from '../../../types';

import { AbilitiesInput } from './AbilitiesInput';


export class SpiritContent extends Component {
  static propTypes = SpiritContentPropTypes;

  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const {
      id, spiritService,
    } = this.props;
    this.setState(this._getNewState(id, spiritService));
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
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetValue(target) {
    switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'number':
      return Number(target.value);
    default:
      return target.value;
    }
  }

  _getNewState = (id, spiritService) => ({
    // ...spiritService.getSpirit(id),
    ...spiritService.get({
      type: 'spirit',
      id,
    }),
    initialized: true,
  })

  handleInputChange(event) {
    const { target } = event;
    const value = this.getTargetValue(target);
    const { name } = target;
    const { id, spiritService } = this.props;

    // spiritService.putSpirit(id, {
    //   [name]: value,
    // });

    spiritService.execute({
      type: 'putSpirit',
      id,
      props: {
        [name]: value,
      },
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
      name, fraction, story, maxHitPoints, initialized,
    } = this.state;
    if (!initialized) {
      return null;
    }
    const { spiritService, id, t } = this.props;

    if (!id) {
      return (
        <div className="SpiritContent tw-flex-grow">
          {t('youHaveNoSpirits')}
        </div>
      );
    }

    return (
      <DocumentTitle title={name}>

        <div className="SpiritContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div className="SpiritContentWorkspace">
            <h2 className="tw-mb-8 tw-w-2/4">
              <Form.Control
                name="name"
                type="text"
                className="tw-text-3xl"
                value={name}
                onChange={this.handleInputChange}
              />
            </h2>

            <div className="tw-table">
              <div className="tw-table-column tw-w-1/6" />
              {/* <h3 className="table-caption">Spirit info</h3> */}
              {/* <div className="table-row">
                <div className="table-cell">Aura</div>
                <div className="table-cell">
                  {aura}
                </div>
              </div> */}
              <div className="tw-table-row">
                <label htmlFor="fractionInput" className="tw-table-cell">{t('fraction')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="fraction"
                    type="text"
                    className="tw-w-2/4"
                    id="fractionInput"
                    value={fraction}
                    onChange={this.handleInputChange}
                    list="fraction-datalist"
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="maxHitPointsInput" className="tw-table-cell">{t('maxHitPoints')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="maxHitPoints"
                    type="number"
                    className="tw-w-1/4"
                    id="maxHitPointsInput"
                    value={maxHitPoints}
                    onChange={this.handleInputChange}
                    // list="fraction-datalist"
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="storyInput" className="tw-table-cell">{t('story')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="story"
                    as="textarea"
                    id="storyInput"
                    rows="3"
                    value={story}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="newAbility" className="tw-table-cell">{t('abilities')}</label>
                {/* <div className="table-cell">{abilities.join(', ') || 'None'}</div> */}
                <div className="tw-table-cell">
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
