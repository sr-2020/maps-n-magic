import React, { Component } from 'react';
import './ManaOceanLayer2.css';
import { InnerManaOceanLayer2 } from './InnerManaOceanLayer2';

export class ManaOceanLayer2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationRecords: [],
    };
    this.onPutLocationRecord = this.onPutLocationRecord.bind(this);
    this.updateLocations = this.updateLocations.bind(this);
  }

  componentDidMount() {
    const {
      gameModel, enableByDefault, layerCommunicator,
    } = this.props;
    this.subscribe('on', gameModel);
    // this.manaOceanLayer = new InnerManaOceanLayer();
    // layerCommunicator.emit('setLayersMeta', {
    //   layersMeta: this.manaOceanLayer.getLayersMeta(),
    //   enableByDefault,
    // });
    this.updateLocations();
    console.log('ManaOceanLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel, translator,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.clear();
      this.updateLocations();
    }
    if (prevProps.translator !== translator) {
      this.clear();
      this.updateLocations();
    }
    console.log('ManaOceanLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    // this.communicatorSubscribe('off');
    this.clear();
    console.log('ManaOceanLayer will unmount');
  }

  updateLocations() {
    const {
      gameModel, t, translator,
    } = this.props;
    this.setState({
      locationRecords: gameModel.get('locationRecords'),
    });

    // this.locationsLayer.populate(gameModel, translator, t, this.setMarkerEventHandlers);
    // this.manaOceanLayer.populate(gameModel, translator, t);
  }

  clear() {
    // this.manaOceanLayer.clear();
  }

  subscribe(action, gameModel) {
    gameModel[action]('postLocationRecord', this.updateLocations);
    // gameModel[action]('putLocationRecord', this.onPutLocationRecord);
    gameModel[action]('putLocationRecord', this.updateLocations);
    gameModel[action]('deleteLocationRecord', this.updateLocations);
    gameModel[action]('locationRecordsChanged', this.updateLocations);
  }

  onPutLocationRecord({ locationRecord }) {
    const { t } = this.props;
    // this.manaOceanLayer.onPutLocationRecord(locationRecord, t);
  }

  render() {
    const { locationRecords } = this.state;
    // const {
    //   enableByDefault, layerCommunicator,
    // } = this.props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <InnerManaOceanLayer2
        {...this.props}
        locationRecords={locationRecords}
      />
    );
  }
}
