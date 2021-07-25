import React from 'react';
import './SpiritNav.css';

import { NavLinkData } from 'sr2020-mm-client-core';

import { NavColumn } from "../NavColumn";
import { SpiritConsistency } from '../SpiritConsistency';

const navLinks: NavLinkData[] = [{
//   to: '/backgroundEditorMap',
//   tKey: 'buildingPlansEditor',
// }, {
//   to: '/locationsEditor2',
//   tKey: 'locationsEditor2',
// }, {
  to: '/spiritEditor',
  tKey: 'spiritEditor',
}, {
  to: '/spiritFractionEditor',
  tKey: 'spiritFractionEditor',
}, {
  to: '/spiritRouteEditor',
  tKey: 'spiritRouteEditor',
}, {
  to: '/spiritPhraseEditor',
  tKey: 'spiritPhraseEditor',
}, {
  to: '/spiritsOnMap',
  tKey: 'spiritsOnMap',
}, {
  to: '/spiritConsistency',
  tKey: 'spiritConsistency',
}];

export function SpiritNav() {
  return (
    <div className="SpiritNav tw-flex">
      <NavColumn navLinks={navLinks} tKey="spiritEditors"/>
    </div>
  );
}