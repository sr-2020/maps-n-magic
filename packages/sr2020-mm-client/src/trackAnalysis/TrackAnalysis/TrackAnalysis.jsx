import React, { Component } from 'react';
import './TrackAnalysis.css';

import {
  Route,
} from 'react-router-dom';

import { TrackAnalysisNav } from '../TrackAnalysisNav';

import { RealTrackStats } from '../RealTrackStats';

import { RealTrackLayer } from '../RealTrackLayer';

import { TrackDemoMap } from '../TrackDemoMap';

import { UserTrackAnalysis } from '../UserTrackAnalysis';

import {
  tracksData, beaconLatlngs, userList, beaconLatlngsIndex, beaconIndex,
} from 'sr2020-mm-data/analysis/data/preparedData';

// import { TrackAnalysisPropTypes } from '../../types';

// eslint-disable-next-line max-lines-per-function
export function TrackAnalysis(props) {
  // static propTypes = TrackAnalysisPropTypes;

  const {
    gameModel
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
        gameModel={gameModel}
      >
        <RealTrackLayer
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
            gameModel={gameModel}
          >
            <RealTrackLayer
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
