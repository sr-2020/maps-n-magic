import React from 'react';
import './MapRoutes.css';

import {
  Route,
} from 'react-router-dom';
// import { MapRoutesPropTypes } from '../../types';

import { CommonMap } from '../maps/CommonMap';
import { BackgroundEditorMap } from '../maps/BackgroundEditorMap';
import { LocationEditorMap } from '../maps/LocationEditorMap';

import {
  mapConfig, backgroundEditorGeomanConfig, oldLocationAndMarkerGeomanConfig, locationsEditor2GeomanConfig,
} from '../../configs/map';

import { MapsNav } from '../MapsNav';

export function MapRoutes(props) {
  const {
    curPosition, gameModel, translator,
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
        geomanConfig={oldLocationAndMarkerGeomanConfig}
      />
    </Route>,
    <Route path="/locationsEditor2">
      <LocationEditorMap
        curPosition={curPosition}
        gameModel={gameModel}
        mapConfig={mapConfig}
        translator={translator}
        geomanConfig={locationsEditor2GeomanConfig}
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
