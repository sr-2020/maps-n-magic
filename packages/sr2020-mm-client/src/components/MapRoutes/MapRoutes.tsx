import React from 'react';
import './MapRoutes.css';

import {
  Route,
} from 'react-router-dom';

import { GameModel } from "sr2020-mm-event-engine";


// import * as MapDefaults from '../../configs/map';

// import { CommonMap } from '../../maps/CommonMap';
import { BackgroundEditorMap } from '../../maps/BackgroundEditorMap';
import { LocationEditorMap } from '../../maps/LocationEditorMap';
import { BeaconEditorMap } from '../../maps/BeaconEditorMap';
import { RescueServiceMap } from '../../maps/RescueServiceMap';
import { ManaOceanMap } from '../../maps/ManaOceanMap';
import { AudioEngineDemo } from '../../maps/AudioEngineDemo';
import { SpiritMap } from '../../maps/SpiritMap';
import { CharacterWatcher } from '../CharacterWatcher';

import { MapsNav } from '../MapsNav';

import { 
  backgroundEditorGeomanConfig, 
  locationsEditor2GeomanConfig, 
  beaconEditor2GeomanConfig,
} from '../../configs';
import { LocationEditorMap2 } from '../../maps/LocationEditorMap2';

interface MapRoutesProps {
  gameModel: GameModel;
}

// eslint-disable-next-line max-lines-per-function
export function MapRoutes(props: MapRoutesProps) {
  const {
    gameModel,
  } = props;

  return [
    <Route path="/mapsNav" key="mapsNav">
      <MapsNav />
    </Route>,
    // <Route path="/map2" key="map2">
    //   <CommonMap
    //     gameModel={gameModel}
    //     geomanConfig={oldLocationAndMarkerGeomanConfig}
    //   />
    // </Route>,
    <Route path="/locationsEditor2" key="locationsEditor2">
      <LocationEditorMap
        gameModel={gameModel}
        geomanConfig={locationsEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/locationsEditor3" key="locationsEditor3">
      <LocationEditorMap2
        gameModel={gameModel}
        geomanConfig={locationsEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/beaconEditor2" key="beaconEditor2">
      <BeaconEditorMap
        gameModel={gameModel}
        geomanConfig={beaconEditor2GeomanConfig}
      />
    </Route>,
    <Route path="/backgroundEditorMap" key="backgroundEditorMap">
      <BackgroundEditorMap
        gameModel={gameModel}
        geomanConfig={backgroundEditorGeomanConfig}
      />
    </Route>,
    <Route path="/rescueService" key="rescueService">
      <RescueServiceMap
        gameModel={gameModel}
      />
    </Route>,
    <Route path="/manaOcean" key="manaOcean">
      <ManaOceanMap
        gameModel={gameModel}
      />
    </Route>,
    <Route path="/spiritsOnMap" key="spiritsOnMap">
      <SpiritMap
        gameModel={gameModel}
      />
    </Route>,
    <Route path="/audioEngineDemo" key="audioEngineDemo">
      <CharacterWatcher gameModel={gameModel}>
        <AudioEngineDemo
          gameModel={gameModel}
        />
      </CharacterWatcher>
    </Route>,
  ];
}
