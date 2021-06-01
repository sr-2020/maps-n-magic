import React, { Component, ChangeEvent, useState } from 'react';
import './SpiritContent.css';

import Form from 'react-bootstrap/Form';
import DocumentTitle from 'react-document-title';
import { WithTranslation } from "react-i18next";
import { 
  GameModel, 
  Spirit, 
  GetSpirit, 
  EPutSpiritRequested,
  SpiritTimetable,
} from "sr2020-mm-event-engine";

import { SpiritFractionInput } from "./SpiritFractionInput";
import { RouteInput } from "./RouteInput";

import { WithSpiritRoutes } from '../../../dataHOCs';

// import { AbilitiesInput } from './AbilitiesInput';

import TimePicker, { TimePickerValue } from "react-time-picker";

// function MyApp() {
//   const [value, onChange] = useState('10:00');

//   return (
//     <div>
//       <TimePicker
//         onChange={(value: TimePickerValue) => {
//           if (value instanceof Date) {
//             onChange(value.toString());
//             console.log('date value', value);
//           } else {
//             onChange(value);
//             console.log('string value', value);
//           }
//         }}
//         value={value}
//       />
//     </div>
//   );
// }

interface SpiritContentProps extends WithTranslation, WithSpiritRoutes {
  id: number;
  gameModel: GameModel;
}
type SpiritContentState = {
  initialized: false;
} | {
  initialized: true;
  name: string;
  fraction: number;
  story: string;
  maxHitPoints: number;
  timetable: SpiritTimetable;
};

type spiritFields = 
  | 'name' 
  | 'fraction' 
  | 'story' 
  | 'maxHitPoints'
  | 'timetable'
;

export class SpiritContent extends Component<
  SpiritContentProps, 
  SpiritContentState
> {

  constructor(props: SpiritContentProps) {
    super(props);
    const { gameModel, id } = props;
    
    const spirit = gameModel.get2<GetSpirit>({
      type: 'spirit',
      id,
    });
    
    if (spirit) {
      this.state = {
        initialized: true,
        name: spirit.name,
        fraction: spirit.fraction,
        story: spirit.story,
        maxHitPoints: spirit.maxHitPoints,
        timetable: spirit.timetable,
      };
    } else {
      this.state = {
        initialized: false,
      };
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addRoute = this.addRoute.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetValue(name: spiritFields, target: HTMLInputElement) {
    switch (target.type) {
    case 'checkbox':
      return target.checked;
    case 'number':
      return Number(target.value);
    default:
      if(name === 'fraction') {
        return Number(target.value);
      }
      return target.value;
    }
  }

  handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target } = event;
    const name = target.name as spiritFields;
    const value = this.getTargetValue(name, target);
    const { id, gameModel } = this.props;

    gameModel.emit2<EPutSpiritRequested>({
      type: 'putSpiritRequested',
      id,
      props: {
        [name]: value,
      }
    });

    this.setState(prevState => ({...prevState, [name]: value}));
  }

  addRoute (routeId: number): void {
    this.setState((prevState) => {
      if (!prevState.initialized) {
        return;
      }
      const { timetable } = prevState;
      const changedTimetable = [...timetable, {
        routeId,
        time: 0,
        speedPercent: 100
      }];
      const { id, gameModel } = this.props;

      gameModel.emit2<EPutSpiritRequested>({
        type: 'putSpiritRequested',
        id,
        props: {
          timetable: changedTimetable,
        }
      });

      return {...prevState, timetable: changedTimetable};
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

    const state = this.state;
    if (!state.initialized) {
      return null;
    }
    const {
      name, fraction, story, maxHitPoints, initialized, timetable
    } = state;
    const { gameModel, id, t, spiritRoutes } = this.props;

    if (!id) {
      return (
        <div className="SpiritContent tw-flex-grow">
          {t('youHaveNoSpirits')}
        </div>
      );
    }

    if (spiritRoutes === null) {
      return (
        <div className="SpiritContent tw-flex-grow">
          Фракции еще не загружены
        </div>
      );
    }

    return (
      <DocumentTitle title={name}>

        <div className="SpiritContent tw-flex-grow tw-px-16 tw-py-8 tw-overflow-auto">
          <div>
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
                  <SpiritFractionInput 
                    gameModel={gameModel}
                    id="fractionInput"
                    name="fraction"
                    value={fraction}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="tw-table-row">
                <label htmlFor="fractionInput" className="tw-table-cell">Маршруты</label>
                <div className="tw-table-cell">
                  <RouteInput 
                    spiritRoutes={spiritRoutes}
                    addRoute={this.addRoute}
                  />
                  {
                    timetable.map(timetableItem => (<div>{timetableItem.routeId}</div>))
                  }
                </div>
              </div>
              {/* <div className="tw-table-row">
                <label htmlFor="maxHitPointsInput" className="tw-table-cell">{t('maxHitPoints')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="maxHitPoints"
                    type="number"
                    className="tw-w-1/4"
                    id="maxHitPointsInput"
                    value={maxHitPoints}
                    onChange={this.handleInputChange}
                    disabled
                    // list="fraction-datalist"
                  />
                </div>
              </div> */}
              {/* <div className="tw-table-row">
                <label htmlFor="storyInput" className="tw-table-cell">{t('story')}</label>
                <div className="tw-table-cell">
                  <Form.Control
                    name="story"
                    as="textarea"
                    id="storyInput"
                    rows={3}
                    value={story}
                    disabled
                    onChange={this.handleInputChange}
                  />
                </div>
              </div> */}
              {/* <div className="tw-table-row">
                <label htmlFor="newAbility" className="tw-table-cell">{t('abilities')}</label>
                <div className="tw-table-cell">
                  <AbilitiesInput
                    gameModel={gameModel}
                    id={id}
                  />
                </div>
              </div> */}
            </div>
            {/* <MyApp /> */}

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
