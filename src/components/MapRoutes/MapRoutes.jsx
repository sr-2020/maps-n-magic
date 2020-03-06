import React from 'react';
import './MapRoutes.css';

import {
  Route,
} from 'react-router-dom';
// import { MapRoutesPropTypes } from '../../types';

import { CommonMap } from '../maps/CommonMap';
import { BackgroundEditorMap } from '../maps/BackgroundEditorMap';


import { MapsNav } from '../MapsNav';

export function MapRoutes(props) {
  const {
    curPosition, gameModel, mapConfig, translator, geomanConfig, backgroundEditorGeomanConfig,
  } = props;

  return [
    <Route path="/mapsNav">
      <MapsNav />
    </Route>,
    <Route path="/map2">
      <CommonMap
        curPosition={curPosition}
        gameModel={gameModel}
        mapConfig={mapConfig}
        translator={translator}
        geomanConfig={geomanConfig}
      />
    </Route>,
    <Route path="/backgroundEditorMap">
      <BackgroundEditorMap
        curPosition={curPosition}
        gameModel={gameModel}
        mapConfig={mapConfig}
        translator={translator}
        geomanConfig={backgroundEditorGeomanConfig}
      />
    </Route>,
  ];
}

// MapRoutes.propTypes = MapRoutesPropTypes;
