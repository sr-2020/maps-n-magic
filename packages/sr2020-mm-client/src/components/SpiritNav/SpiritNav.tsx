import React from 'react';
import './SpiritNav.css';

import { NavLinkData } from 'sr2020-mm-client-core';

import { NavColumn } from "../NavColumn";
import { SpiritConsistency } from '../SpiritConsistency';

const navLinks: NavLinkData[] = [{
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
}];

const navLinks2: NavLinkData[] = [{
  to: '/spiritsOnMap',
  tKey: 'spiritsOnMap',
}, {
  to: '/spiritConsistency',
  tKey: 'spiritConsistency',
}, {
  to: '/spiritOverview',
  tKey: 'spiritOverview',
}, {
  to: '/playerMessages',
  tKey: 'playerMessages',
}, {
  to: '/spiritCatchers',
  tKey: 'spiritCatchers',
}, {
  to: '/orgCatchSpirit',
  tKey: 'orgCatchSpirit',
}];

export function SpiritNav() {
  return (
    <div className="SpiritNav tw-flex">
      <NavColumn navLinks={navLinks} tKey="spiritEditors"/>
      <NavColumn navLinks={navLinks2} tKey="spiritViewers"/>
    </div>
  );
}