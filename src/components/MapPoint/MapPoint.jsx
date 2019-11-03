import React from 'react';
import './MapPoint.css';
import { MapPointPropTypes } from '../../types';

export function MapPoint(props) {
  const {
    x, y, fill, r = 2,
  } = props;

  return (
    <circle r={r} cx={x} cy={y} fill={fill || 'red'} />
  );
}

MapPoint.propTypes = MapPointPropTypes;
