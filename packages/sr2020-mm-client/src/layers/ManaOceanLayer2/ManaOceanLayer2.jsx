import React, { Component } from 'react';
import './ManaOceanLayer2.css';
import { InnerManaOceanLayer2 } from '../InnerManaOceanLayer2';

export class ManaOceanLayer2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationRecords: [],
    };
    this.updateLocations = this.updateLocations.bind(this);
  }

  componentDidMount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('on', gameModel);
    this.updateLocations();
    console.log('ManaOceanLayer mounted');
  }

  componentDidUpdate(prevProps) {
    const {
      gameModel,
    } = this.props;
    if (prevProps.gameModel !== gameModel) {
      this.subscribe('off', prevProps.gameModel);
      this.subscribe('on', gameModel);
      this.updateLocations();
    }
    console.log('ManaOceanLayer did update');
  }

  componentWillUnmount() {
    const {
      gameModel,
    } = this.props;
    this.subscribe('off', gameModel);
    console.log('ManaOceanLayer will unmount');
  }

  updateLocations() {
    const {
      gameModel,
    } = this.props;
    this.setState({
      locationRecords: gameModel.get('locationRecords'),
    });
  }

  subscribe(action, gameModel) {
    gameModel[action]('locationRecordsChanged2', this.updateLocations);
  }

  render() {
    const { locationRecords } = this.state;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <InnerManaOceanLayer2
        {...this.props}
        locationRecords={locationRecords}
      />
    );
  }
}
