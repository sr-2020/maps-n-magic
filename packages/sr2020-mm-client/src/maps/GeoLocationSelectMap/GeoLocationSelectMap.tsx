import React from 'react';
import './GeoLocationSelectMap.css';

import { 
  L,
  Map,
  DefaultSatelliteBackground,
  BaseContourLayer2
} from 'sr2020-mm-client-core';
import { GameModel } from "sr2020-mm-event-engine";

import { BackgroundImageDisplayLayer } from '../../layers/BackgroundImageDisplayLayer';
import { LocationGroupLayer } from '../../layers/LocationLayer4/LocationGroupLayer';
import { locationTypesEnum, locationTypeToLayerTkey } from '../../layers/LocationLayer4/LocationLayerTypes';

import { WithTranslation } from 'react-i18next';
import { WithGeoLocationRecords } from '../../dataHOCs';

interface GeoLocationSelectMapProps extends WithGeoLocationRecords, WithTranslation {
  gameModel: GameModel;
  onLocationClick?: L.LeafletEventHandlerFn;
}

export function GeoLocationSelectMap(props: GeoLocationSelectMapProps) {
  const {
    gameModel, geoLocationRecords, onLocationClick
  } = props;

  return (
    <Map
      gameModel={gameModel}
      commonPropsExtension={{
        gameModel,
      }}
    >
      {/* @ts-ignore */}
      <DefaultSatelliteBackground enableByDefault={false} />
      {/* @ts-ignore */}
      <BaseContourLayer2
        enableByDefault
        grayscale
      />
      <BackgroundImageDisplayLayer
        enableByDefault
        imageClassName="grayscale tw-opacity-20"
      />
      
      {/* @ts-ignore */}
      <LocationGroupLayer
        {...props}
        enableByDefault
        geoLayerName={locationTypesEnum.geoLocation}
        // @ts-ignore
        nameKey={locationTypeToLayerTkey(locationTypesEnum.geoLocation) + '_static'}
        locationRecords={geoLocationRecords}
        onLocationClick={onLocationClick}
      />
    </Map>
  );
}
