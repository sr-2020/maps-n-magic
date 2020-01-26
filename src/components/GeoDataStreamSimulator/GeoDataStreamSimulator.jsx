import React, { Component } from 'react';
import './GeoDataStreamSimulator.css';

import { animate, Timing } from '../../utils/animation';

import { Translator } from '../Map2/Translator';

import { GeoDataStreamSimulatorPropTypes } from '../../types';

export class GeoDataStreamSimulator extends Component {
  static propTypes = GeoDataStreamSimulatorPropTypes;

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount = () => {
    const {
      simulateGeoDataStream, center,
    } = this.props;

    this.translator = new Translator(center, this.props.curPosition);

    if (simulateGeoDataStream) {
      this.simulateUserMovement(center);
    }
    console.log('GeoDataStreamSimulator mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.simulateGeoDataStream !== this.props.simulateGeoDataStream) {
      this.refreshUserMovementSimulation();
    }
    if (prevProps.curPosition !== this.props.curPosition) {
      const { center, curPosition } = this.props;
      // this.map.panTo(this.props.curPosition || center);
      // console.log('position changed');
      this.translator = new Translator(center, curPosition);
      // this.clearMapData();
    }
    console.log('GeoDataStreamSimulator did update');
  }

  componentWillUnmount = () => {
    this.stopUserMovement();
    console.log('GeoDataStreamSimulator will unmount');
  }

  simulateUserMovement(center) {
    const speed = 1;
    const rx = 0.0005;
    const ry = 0.0007;

    const { gameModel } = this.props;

    this.stopUserMovement();

    const that = this;
    this.userMovementSimulation = animate({
      duration: 120000,
      timing: Timing.makeEaseInOut(Timing.linear),
      draw(progress) {
        const center2 = that.translator.moveFrom(center);
        const artificialPos = {
          coords: {
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: center2[0] + Math.cos(progress * speed * 2 * Math.PI) * rx,
            longitude: center2[1] + Math.sin(progress * speed * 2 * Math.PI) * ry,
            speed: null,
          },
          timestamp: Date.now(),
          artificial: true,
        };

        // this.map._handleGeolocationResponse(artificialPos);
        gameModel.execute({
          type: 'updateUserPosition',
          pos: artificialPos,
        });
      },
      loop: true,
    });
  }

  refreshUserMovementSimulation() {
    const { simulateGeoDataStream, curPosition, center } = this.props;
    if (simulateGeoDataStream) {
      // const { center } = mapConfig;
      this.simulateUserMovement(curPosition || center);
    } else {
      this.stopUserMovement();
    }
  }

  stopUserMovement() {
    if (this.userMovementSimulation) {
      this.userMovementSimulation.enable = false;
    }
  }

  render() {
    return null;
  }
}
