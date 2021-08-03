import React from 'react';
import './MapsNav.css';

import { NavLinkData } from 'sr2020-mm-client-core';

import { NavColumn } from "../NavColumn";

const navLinks: NavLinkData[] = [{
  to: '/backgroundEditorMap',
  tKey: 'buildingPlansEditor',
}, {
  to: '/locationsEditor2',
  tKey: 'locationsEditor2',
}, {
  to: '/locationsEditor3',
  tKey: 'locationsEditor3',
}, {
  to: '/beaconEditor2',
  tKey: 'beaconEditor2',
// }, {
//   to: '/map2',
//   tKey: 'locationsAndBeaconsEditor',
}];

const navLinks2: NavLinkData[] = [{
  to: '/rescueService',
  tKey: 'rescueService',
}, {
  to: '/manaOcean',
  tKey: 'manaOcean',
}, {
  to: '/audioEngineDemo',
  tKey: 'audioEngineDemo',
}, {
  to: '/overviewPage',
  tKey: 'overviewPage',
}];

const navLinks3: NavLinkData[] = [{
  to: '/manaOceanSettings',
  tKey: 'manaOceanSettings',
}, {
  to: '/manaOceanEffectSettings',
  tKey: 'manaOceanEffectSettings',
}, {
  to: '/characterPositions',
  tKey: 'characterPositions',
}, {
  to: '/rescueServiceMessageSender',
  tKey: 'rescueServiceMessageSender',
}];

export function MapsNav() {
  return (
    <div className="MapsNav tw-flex">
      <NavColumn navLinks={navLinks} tKey="mapEditors"/>
      <NavColumn navLinks={navLinks2} tKey="specificMaps"/>
      <NavColumn navLinks={navLinks3} tKey="debuggingTools"/>
    </div>
  );
}