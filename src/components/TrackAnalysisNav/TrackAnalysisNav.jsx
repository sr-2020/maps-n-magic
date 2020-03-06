import React from 'react';
import './TrackAnalysisNav.css';

import { NavList } from '../NavList';

const navLinks = [{
  to: '/realTrackStats',
  tKey: 'realTrackStats',
}, {
  to: '/trackDemo',
  tKey: 'trackDemo',
}, {
  to: '/userTrackAnalysis',
  tKey: 'userTrackAnalysis',
}];

// import { TrackAnalysisNavPropTypes } from '../../types';

export function TrackAnalysisNav() {
  return (
    <div className="TrackAnalysisNav mx-8 my-4">
      <NavList navLinks={navLinks} />
    </div>
  );
}

// TrackAnalysisNav.propTypes = TrackAnalysisNavPropTypes;
