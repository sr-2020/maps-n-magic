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
    gameModel, translator, mapDefaults
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
        gameModel={gameModel}
        translator={translator}
        geomanConfig={oldLocationAndMarkerGeomanConfig}
      />
    </Route>,
    <Route path="/locationsEditor2">
      <LocationEditorMap
        gameModel={gameModel}
        translator={translator}
        geomanConfig={locationsEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/beaconEditor2">
      <BeaconEditorMap
        gameModel={gameModel}
        translator={translator}
        geomanConfig={beaconEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/backgroundEditorMap">
      <BackgroundEditorMap
        gameModel={gameModel}
        translator={translator}
        geomanConfig={backgroundEditorGeomanConfig}
      />
    </Route>,
    <Route path="/rescueService">
      <RescueServiceMap
        gameModel={gameModel}
        translator={translator}
      />
    </Route>,
  ];
}

// MapRoutes.propTypes = MapRoutesPropTypes;
