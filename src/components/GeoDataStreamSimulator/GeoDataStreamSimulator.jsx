import React, { Component } from 'react';
import './GeoDataStreamSimulator.css';

import { animate, Timing } from '../../utils/animation';

// import { GeoDataStreamSimulatorPropTypes } from '../../types';

export class GeoDataStreamSimulator extends Component {
  // static propTypes = GeoDataStreamSimulatorPropTypes;

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount = () => {
    const {
      simulateGeoDataStream, center,
    } = this.props;

    if (simulateGeoDataStream) {
      this.simulateUserMovement(center);
    }
    console.log('GeoDataStreamSimulator mounted');
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.simulateGeoDataStream !== this.props.simulateGeoDataStream) {
      this.refreshUserMovementSimulation();
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

    this.userMovementSimulation = animate({
      duration: 20000,
      timing: Timing.makeEaseInOut(Timing.linear),
      draw(progress) {
        const artificialPos = {
          coords: {
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: center[0] + Math.cos(progress * speed * 2 * Math.PI) * rx,
            longitude: center[1] + Math.sin(progress * speed * 2 * Math.PI) * ry,
            speed: null,
          },
          timestamp: Date.now(),
          artificial: true,
        };

        // this.map._handleGeolocationResponse(artificialPos);
        gameModel.setUserPosition(artificialPos);
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
    return (
      <div className="GeoDataStreamSimulator hidden" />
    );
  }
}
