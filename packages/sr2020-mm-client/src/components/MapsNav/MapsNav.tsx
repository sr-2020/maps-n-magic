import React from 'react';
import './MapsNav.css';

import { NavList, NavLinkData } from 'sr2020-mm-client-core';
import { useTranslation } from "react-i18next";

const navLinks: NavLinkData[] = [{
  to: '/backgroundEditorMap',
  tKey: 'buildingPlansEditor',
}, {
  to: '/locationsEditor2',
  tKey: 'locationsEditor2',
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

// import { MapsNavPropTypes } from '../../types';

export function MapsNav() {
  const { t } = useTranslation();
  return (
    <div className="MapsNav tw-flex">
      <div className="tw-mx-8 tw-my-4">
        <h2 className="tw-mt-8 tw-mb-4 tw-font-medium tw-text-2xl">{t('mapEditors')}</h2>
        <NavList navLinks={navLinks} />
      </div>
      <div className="tw-mx-8 tw-my-4">
        <h2 className="tw-mt-8 tw-mb-4 tw-font-medium tw-text-2xl">{t('specificMaps')}</h2>
        <NavList navLinks={navLinks2} />
      </div>
      <div className="tw-mx-8 tw-my-4">
        <h2 className="tw-mt-8 tw-mb-4 tw-font-medium tw-text-2xl">{t('debuggingTools')}</h2>
        <NavList navLinks={navLinks3} />
      </div>
    </div>
  );
}
