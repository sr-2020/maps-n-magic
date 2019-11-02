import React, { Component, Fragment } from 'react';
import './MainPolygon.css';
import { polygon2polyline } from '../../utils/polygonUtils';
import { MapPoint } from '../MapPoint';

class MainPolygon extends Component {
  state = {
  };

  render() {
    const { mainPolygon } = this.props;
    return (
      <>

        <polyline
          fill="none"
          stroke="red"
          strokeWidth="4"
          opacity="0.5"
          points={polygon2polyline(mainPolygon)}
        />
        {
          mainPolygon.map((point) => <MapPoint x={point[0]} y={point[1]} r={5} />)
        }
      </>
    );
  }
}

export { MainPolygon };
