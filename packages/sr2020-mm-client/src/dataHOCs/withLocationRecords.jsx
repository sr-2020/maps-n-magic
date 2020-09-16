import React, { useState, useEffect } from 'react';
// import { TranslatorConsumer } from './translatorContext';

export const withLocationRecords = (Wrapped) => (props) => {
  const { gameModel } = props;
  const [locationRecords, setLocationRecords] = useState([]);

  function updateLocations({ locationRecords: newLocationRecords }) {
    setLocationRecords(newLocationRecords);
  }

  useEffect(() => {
    gameModel.on('locationRecordsChanged2', updateLocations);
    updateLocations({
      locationRecords: gameModel.get('locationRecords'),
    });

    return () => {
      gameModel.off('locationRecordsChanged2', updateLocations);
      // group.clearLayers();
    };
  }, [gameModel]);

  return <Wrapped {...props} locationRecords={locationRecords} />;
};

// import React, { Component } from 'react';
// import './ManaOceanLayer2.css';
// import { InnerManaOceanLayer2 } from './InnerManaOceanLayer2';

// export class ManaOceanLayer2 extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       locationRecords: [],
//     };
//     this.updateLocations = this.updateLocations.bind(this);
//   }

//   componentDidMount() {
//     const {
//       gameModel,
//     } = this.props;
//     this.subscribe('on', gameModel);
//     this.updateLocations();
//     console.log('ManaOceanLayer mounted');
//   }

//   componentDidUpdate(prevProps) {
//     const {
//       gameModel,
//     } = this.props;
//     if (prevProps.gameModel !== gameModel) {
//       this.subscribe('off', prevProps.gameModel);
//       this.subscribe('on', gameModel);
//       this.updateLocations();
//     }
//     console.log('ManaOceanLayer did update');
//   }

//   componentWillUnmount() {
//     const {
//       gameModel,
//     } = this.props;
//     this.subscribe('off', gameModel);
//     console.log('ManaOceanLayer will unmount');
//   }

//   updateLocations() {
//     const {
//       gameModel,
//     } = this.props;
//     this.setState({
//       locationRecords: gameModel.get('locationRecords'),
//     });
//   }

//   subscribe(action, gameModel) {
//     gameModel[action]('locationRecordsChanged2', this.updateLocations);
//   }

//   render() {
//     const { locationRecords } = this.state;
//     // eslint-disable-next-line react/jsx-props-no-spreading
//     return (
//       <InnerManaOceanLayer2
//         {...this.props}
//         locationRecords={locationRecords}
//       />
//     );
//   }
// }
