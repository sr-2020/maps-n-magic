import React from 'react';
import './OverviewPage.css';

import { WithTranslation } from "react-i18next";
import { GameModel } from 'sr2020-mm-event-engine';
import { RescueServiceMap } from '../../../maps/RescueServiceMap';
import { ManaOceanMap } from '../../../maps/ManaOceanMap';
import { SpiritMap } from '../../../maps/SpiritMap';
import { MapDefaults, MapDefaultsProvider, TileLayerData } from 'sr2020-mm-client-core';
import { mapDefaults } from '../../../configs';
import { CharacterWatcher } from '../../CharacterWatcher';
import { AudioEngineDemo } from '../../../maps/AudioEngineDemo';

interface OverviewPageProps extends WithTranslation {
  gameModel: GameModel;
}

const maxZoom: number = 20;

const googleTileLayer: TileLayerData = {
  urlTemplate: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  options: {
    maxZoom,
    opacity: 0.4,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
};

const mapConfig = {
  // lat: 54.92912999834723,
  // // lng: 36.87105243803666,
  // lng: 36.87405243803666,
  lat: 54.92852999834723,
  // lng: 36.87105243803666,
  lng: 36.87005243803666,
  zoom: 16,
  center: [0, 0] as [number, number]
};

mapConfig.center = [mapConfig.lat, mapConfig.lng];

const overrideMapDefaults: MapDefaults = {
  defaultTileLayer: googleTileLayer,
  defaultZoom: mapConfig.zoom,
  defaultCenter: mapConfig.center
}

export function OverviewPage(props: OverviewPageProps) {
  const { gameModel } = props;

  return (
    <div className="OverviewPage tw-h-full tw-flex tw-flex-col ">
      <MapDefaultsProvider value={overrideMapDefaults}>
      {/* <MapDefaultsProvider value={mapDefaults}> */}
        <div className="tw-flex-1  tw-flex">
          <div className="tw-flex-1  tw-p-2">
            {/* 1 */}
            <RescueServiceMap
              gameModel={gameModel}
            />
          </div>
          <div className="tw-flex-1  tw-p-2">
            {/* 2 */}
            <ManaOceanMap
              gameModel={gameModel}
            />
          </div>
        </div>
        <div className="tw-flex-1  tw-flex">
          <div className="tw-flex-1  tw-p-2">
            {/* 3 */}
            <SpiritMap
              gameModel={gameModel}
            />
          </div>
          <div className="tw-flex-1  tw-p-2">
            {/* 4 */}
            <CharacterWatcher gameModel={gameModel}>
              <AudioEngineDemo
                gameModel={gameModel}
              />
            </CharacterWatcher>
          </div>
        </div>
      </MapDefaultsProvider>
    </div>
  );
}



