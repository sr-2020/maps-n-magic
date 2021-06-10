
import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { 
  LocationRecord,
  Spirit
} from "sr2020-mm-event-engine";

import { WithGeoLocationRecords, WithSpirits } from "./index";

export interface SpiritLocation extends LocationRecord {
  spiritNames: string[];
}

export interface WithSpiritLocationData {
  spiritLocations: SpiritLocation[];
}

export const withSpiritLocationData = (Wrapped: any) => (props: any) => {
  const { geoLocationRecords } = props as WithGeoLocationRecords;
  const { spirits } = props as WithSpirits;
  const spiritLocations = getCombinedData(geoLocationRecords, spirits);
  return <Wrapped {...props} spiritLocations={spiritLocations} />;
};

function getCombinedData(
  geoLocationRecords: LocationRecord[], 
  spirits: Spirit[] | null
): SpiritLocation[] {
  if (spirits === null) {
    return [];
  }
  if (geoLocationRecords.length === 0) {
    return [];
  }
  const spiritsByLocIndex = spirits.reduce((acc: Record<number, string[]>, spirit) => {
    const { state } = spirit; 
    if (state.status === 'OnRoute') {
      const locationId = state.route.waypoints[state.waypointIndex];
      if (acc[locationId] === undefined) {
        acc[locationId] = [];
      }
      acc[locationId].push(spirit.name);
    }
    return acc;
  }, {});
  Object.values(spiritsByLocIndex).forEach(arr => arr.sort());

  const spiritLocations: SpiritLocation[] = geoLocationRecords.reduce((acc: SpiritLocation[], location) => {
    if (spiritsByLocIndex[location.id] !== undefined) {
      acc.push({
        ...location,
        spiritNames: spiritsByLocIndex[location.id]
      });
    }
    return acc;
  }, []);

  return spiritLocations;
}