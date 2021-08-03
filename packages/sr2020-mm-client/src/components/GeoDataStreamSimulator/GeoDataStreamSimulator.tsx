export {};
// import React, { Component } from 'react';
// import './GeoDataStreamSimulator.css';

// import { animate, Timing } from 'sr2020-mm-client-core';

// export class GeoDataStreamSimulator extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   componentDidMount = () => {
//     const {
//       simulateGeoDataStream, defaultCenter
//     } = this.props;

//     if (simulateGeoDataStream) {
//       this.simulateUserMovement(defaultCenter);
//     }
//     console.log('GeoDataStreamSimulator mounted');
//   }

//   componentDidUpdate = (prevProps) => {
//     if (prevProps.simulateGeoDataStream !== this.props.simulateGeoDataStream) {
//       this.refreshUserMovementSimulation();
//     }
//     console.log('GeoDataStreamSimulator did update');
//   }

//   componentWillUnmount = () => {
//     this.stopUserMovement();
//     console.log('GeoDataStreamSimulator will unmount');
//   }

//   simulateUserMovement(center) {
//     const speed = 1;
//     const rx = 0.0005;
//     const ry = 0.0007;

//     const { gameModel, translator } = this.props;

//     this.stopUserMovement();

//     this.userMovementSimulation = animate({
//       duration: 120000,
//       timing: Timing.makeEaseInOut(Timing.linear),
//       draw(progress) {
//         const center2 = translator.moveFrom(center);
//         const artificialPos = {
//           coords: {
//             accuracy: 10,
//             altitude: null,
//             altitudeAccuracy: null,
//             heading: null,
//             latitude: center2[0] + Math.cos(progress * speed * 2 * Math.PI) * rx,
//             longitude: center2[1] + Math.sin(progress * speed * 2 * Math.PI) * ry,
//             speed: null,
//           },
//           timestamp: Date.now(),
//           artificial: true,
//         };

//         // this.map._handleGeolocationResponse(artificialPos);
//         gameModel.execute({
//           type: 'updateUserPosition',
//           pos: artificialPos,
//         });
//       },
//       loop: true,
//     });
//   }

//   refreshUserMovementSimulation() {
//     const { simulateGeoDataStream, translator, defaultCenter } = this.props;
//     if (simulateGeoDataStream) {
//       this.simulateUserMovement(translator.getVirtualCenter() || defaultCenter);
//     } else {
//       this.stopUserMovement();
//     }
//   }

//   stopUserMovement() {
//     if (this.userMovementSimulation) {
//       this.userMovementSimulation.enable = false;
//     }
//   }

//   render() {
//     return null;
//   }
// }
