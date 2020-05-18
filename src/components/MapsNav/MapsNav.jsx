import React from 'react';
import './MapsNav.css';

import { NavList } from '../NavList';

const navLinks = [{
  to: '/backgroundEditorMap',
  tKey: 'buildingPlansEditor',
}, {
  to: '/locationsEditor2',
  tKey: 'locationsEditor2',
}, {
  to: '/beaconEditor2',
  tKey: 'beaconEditor2',
}, {
  to: '/map2',
  tKey: 'locationsAndBeaconsEditor',
}];

const navLinks2 = [{
  to: '/manaOceanSettings',
  tKey: 'manaOceanSettings',
}];

// import { MapsNavPropTypes } from '../../types';

export function MapsNav(props) {
  const { t } = props;

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
    </div>
  );
}

// MapsNav.propTypes = MapsNavPropTypes;
