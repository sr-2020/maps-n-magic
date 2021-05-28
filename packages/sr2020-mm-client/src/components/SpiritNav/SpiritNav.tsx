import React from 'react';
import './SpiritNav.css';

import { NavLinkData } from 'sr2020-mm-client-core';

import { NavColumn } from "../NavColumn";

const navLinks: NavLinkData[] = [{
//   to: '/backgroundEditorMap',
//   tKey: 'buildingPlansEditor',
// }, {
//   to: '/locationsEditor2',
//   tKey: 'locationsEditor2',
// }, {
  to: '/spiritEditor',
  tKey: 'spiritEditor',
// }, {
//   to: '/map2',
//   tKey: 'locationsAndBeaconsEditor',
}];

export function SpiritNav() {
  return (
    <div className="SpiritNav tw-flex">
      <NavColumn navLinks={navLinks} tKey="spiritEditors"/>
    </div>
  );
}