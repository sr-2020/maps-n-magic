import React from 'react';
import './MapRoutes.css';

import {
  Route,
} from 'react-router-dom';
// import { MapRoutesPropTypes } from '../../types';

import { CommonMap } from '../../maps/CommonMap';
import { BackgroundEditorMap } from '../../maps/BackgroundEditorMap';
import { LocationEditorMap } from '../../maps/LocationEditorMap';
import { BeaconEditorMap } from '../../maps/BeaconEditorMap';
import { RescueServiceMap } from '../../maps/RescueServiceMap';

import { MapsNav } from '../MapsNav';

// eslint-disable-next-line max-lines-per-function
export function MapRoutes(props) {
  const {
    curPosition, gameModel, translator, mapDefaults
  } = props;
  const {
    backgroundEditorGeomanConfig, oldLocationAndMarkerGeomanConfig, locationsEditor2GeomanConfig, beaconEditor2GeomanConfig,
  } = mapDefaults;

  return [
    <Route path="/mapsNav">
      <MapsNav />
    </Route>,
    <Route path="/map2">
      <CommonMap
        curPosition={curPosition}
        gameModel={gameModel}
        translator={translator}
        geomanConfig={oldLocationAndMarkerGeomanConfig}
      />
    </Route>,
    <Route path="/locationsEditor2">
      <LocationEditorMap
        curPosition={curPosition}
        gameModel={gameModel}
        translator={translator}
        geomanConfig={locationsEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/beaconEditor2">
      <BeaconEditorMap
        curPosition={curPosition}
        gameModel={gameModel}
        translator={translator}
        geomanConfig={beaconEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/backgroundEditorMap">
      <BackgroundEditorMap
        curPosition={curPosition}
        gameModel={gameModel}
        translator={translator}
        geomanConfig={backgroundEditorGeomanConfig}
      />
    </Route>,
    <Route path="/rescueService">
      <RescueServiceMap
        curPosition={curPosition}
        gameModel={gameModel}
        translator={translator}
      />
    </Route>,
  ];
}

// MapRoutes.propTypes = MapRoutesPropTypes;
