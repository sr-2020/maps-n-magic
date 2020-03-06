import React from 'react';
import './MapsNav.css';

import { NavList } from '../NavList';

const navLinks = [{
  to: '/backgroundEditorMap',
  tKey: 'buildingPlansEditor',
}, {
  to: '/map2',
  tKey: 'locationsAndBeaconsEditor',
}];

// import { MapsNavPropTypes } from '../../types';

export function MapsNav(props) {
  const { t } = props;

  return (
    <div className="MapsNav">
      <div className="mx-8 my-4">
        <h2 className="mt-8 mb-4 font-medium text-2xl">{t('mapEditors')}</h2>
        <NavList navLinks={navLinks} />
      </div>
    </div>
  );
}

// MapsNav.propTypes = MapsNavPropTypes;
