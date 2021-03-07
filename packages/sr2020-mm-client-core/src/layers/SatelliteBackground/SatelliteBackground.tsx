import React, {
  Component, useState, useEffect, useContext,
} from 'react';
import './SatelliteBackground.css';

import L from 'leaflet';

export function SatelliteBackground(props) {
  const [group] = useState(L.layerGroup([]));
  const {
    enableByDefault, layerCommunicator, layerNameKey, tileLayerUrlTemplate, tileLayerOptions,
  } = props;

  useEffect(() => {
    layerCommunicator.emit('setLayersMeta', {
      layersMeta: {
        [layerNameKey]: group,
      },
      enableByDefault,
    });
    group.addLayer(L.tileLayer(tileLayerUrlTemplate, tileLayerOptions));
    return () => {
      group.clearLayers();
    };
  }, []);

  return null;
}

// export class SatelliteBackground2 extends Component {
//   // static propTypes = SatelliteBackgroundPropTypes;
//   group = L.layerGroup([]);

//   nameKey = 'satelliteLayer';

//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   componentDidMount() {
//     const {
//       enableByDefault, layerCommunicator,
//     } = this.props;
//     layerCommunicator.emit('setLayersMeta', {
//       layersMeta: this.getLayersMeta(),
//       enableByDefault,
//     });
//     this.populate();
//     console.log('SatelliteBackground mounted');
//   }

//   componentDidUpdate(prevProps) {
//     console.log('SatelliteBackground did update');
//   }

//   getLayersMeta() {
//     return {
//       [this.nameKey]: this.group,
//     };
//   }

//   componentWillUnmount() {
//     this.clear();
//     console.log('SatelliteBackground will unmount');
//   }

//   populate() {
//     const { mapDefaults } = this.props;
//     const { urlTemplate, options } = mapDefaults.defaultTileLayer;
//     this.group.addLayer(L.tileLayer(urlTemplate, options));
//   }

//   clear() {
//     this.group.clearLayers();
//   }

//   render() {
//     return null;
//   }
// }
