import React from 'react';
import './TrackAnalysisNav.css';

import { NavList } from 'sr2020-mm-client-core/components/NavList';
// import { NavList } from '../NavList';

import { TestComponent } from "sr2020-mm-client-core/components/TestComponent.jsx";

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
    <div className="TrackAnalysisNav tw-mx-8 tw-my-4">
      <TestComponent />
      <NavList navLinks={navLinks} />
    </div>
  );
}

// TrackAnalysisNav.propTypes = TrackAnalysisNavPropTypes;
