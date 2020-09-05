import React, { Component } from 'react';
import './TrackAnalysis.css';

import {
  Route,
} from 'react-router-dom';

import { TrackAnalysisNav } from '../TrackAnalysisNav';

import { RealTrackStats } from '../RealTrackStats';

import { RealTrackDemo } from '../maps/layers/RealTrackDemo';

import { TrackDemoMap } from '../maps/TrackDemoMap';

import { UserTrackAnalysis } from '../UserTrackAnalysis';

import {
  tracksData, beaconLatlngs, userList, beaconLatlngsIndex, beaconIndex,
} from 'sr2020-mm-data/analysis/data/preparedData';

// import { TrackAnalysisPropTypes } from '../../types';

// eslint-disable-next-line max-lines-per-function
export function TrackAnalysis(props) {
  // static propTypes = TrackAnalysisPropTypes;

  const {
    curPosition, gameModel, mapConfig, translator,
  } = props;

  return [
    <Route path="/trackAnalysisNav">
      <TrackAnalysisNav />
    </Route>,
    <Route path="/realTrackStats">
      <RealTrackStats
        tracksData={tracksData}
        beaconIndex={beaconIndex}
        beaconLatlngsIndex={beaconLatlngsIndex}
      />
    </Route>,

    <Route path="/trackDemo">
      <TrackDemoMap
        curPosition={curPosition}
        gameModel={gameModel}
        mapConfig={mapConfig}
        translator={translator}
      >
        <RealTrackDemo
          enableByDefault
          tracksData={tracksData}
          beaconLatlngs={beaconLatlngs}
        />
      </TrackDemoMap>
    </Route>,

    <Route path="/userTrackAnalysis">
      <UserTrackAnalysis
        tracksData={tracksData}
        beaconIndex={beaconIndex}
        beaconLatlngsIndex={beaconLatlngsIndex}
        defaultSelectedUser={userList[18].userId}
        userList={userList}
        drawMap={({ userData }) => (
          <TrackDemoMap
            curPosition={curPosition}
            gameModel={gameModel}
            mapConfig={mapConfig}
            translator={translator}
          >
            <RealTrackDemo
              enableByDefault
              tracksData={userData}
              beaconLatlngs={beaconLatlngs}
            />
          </TrackDemoMap>
        )}
      />
    </Route>,
  ];
}
