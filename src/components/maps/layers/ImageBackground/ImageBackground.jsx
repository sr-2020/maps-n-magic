import React, { Component } from 'react';
import './ImageBackground.css';

import L from 'leaflet/dist/leaflet-src';

// import { ImageBackgroundPropTypes } from '../../types';

export class ImageBackground extends Component {
  // static propTypes = ImageBackgroundPropTypes;

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const {
      layerCommunicator,
    } = this.props;
    // Svg image proof of concept
    // const imageUrl = 'images/test.svg';
    // const imageUrl = 'images/sr2020_base_map1.svg';
    const imageUrl = 'images/sr2020_base_map2.svg';
    const width = 976;
    const height = 578;

    // (y1 - y2) / height = (x2 - x1) / width
    const y1 = 54.930300122616605;
    const x1 = 36.86880692955018;
    const y2 = 54.926889453719246;
    const x2 = 36.87855139322438;
    // const x2 = ((y1 - y2) / height) * width + x1;
    const imageBounds = [
      [y1, x1],
      [y2, x2],
    ];
    // const imageBounds = [
    //   [54.93064336, 36.868368075],
    //   [54.92720824, 36.874747825]
    // ];
    // L.imageOverlay(imageUrl, imageBounds)
    layerCommunicator.emit('addToMap', {
      control: L.imageOverlay(imageUrl, imageBounds),
    });
    console.log('ImageBackground mounted');
  }

  componentDidUpdate() {
    console.log('ImageBackground did update');
  }

  componentWillUnmount() {
    console.log('ImageBackground will unmount');
  }

  render() {
    return null;
  }
}
