import React, { Component, Fragment } from 'react';
import './MainPolygon.css';
import { polygon2polyline } from '../../utils/polygonUtils';
import { MapPoint } from '../MapPoint';
import { MainPolygonPropTypes } from '../../types';


export function MainPolygon(props) {
  const { mainPolygon } = props;
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
        // eslint-disable-next-line react/no-array-index-key
        mainPolygon.map((point, i) => <MapPoint key={i} x={point[0]} y={point[1]} r={5} />)
      }
    </>
  );
}

MainPolygon.propTypes = MainPolygonPropTypes;
