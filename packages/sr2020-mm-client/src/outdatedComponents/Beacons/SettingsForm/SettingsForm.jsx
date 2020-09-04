/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './SettingsForm.css';

import Button from 'react-bootstrap/Button';

import { SettingsFormPropTypes } from '../../../types';

// eslint-disable-next-line max-lines-per-function
export function SettingsForm(props) {
  const {
    showBeaconMarkers, showPolygonLabels, showPolygonBoundaries, showMassCenters, showBeaconSignalArea, signalRadius,
    enableAutoIteration, maxDelta, showTracks,
    toggleCheckbox, onStateChange, nextIteration, clearPolygon, clearBeacons, clearTracks,
  } = props;

  return (
    <div className="flex-row">

      <div className="margin-1rem">

        <input
          id="showBeaconMarkersInput"
          type="checkbox"
          onChange={toggleCheckbox('showBeaconMarkers')}
          checked={showBeaconMarkers}
        />
        <label htmlFor="showBeaconMarkersInput">Show beacon markers</label>
        <br />
        <input
          id="showPolygonLabelsInput"
          type="checkbox"
          onChange={toggleCheckbox('showPolygonLabels')}
          checked={showPolygonLabels}
        />
        <label htmlFor="showPolygonLabelsInput">Show polygon labels</label>
        <br />
        <input
          id="showPolygonBoundariesInput"
          type="checkbox"
          onChange={toggleCheckbox('showPolygonBoundaries')}
          checked={showPolygonBoundaries}
        />
        <label htmlFor="showPolygonBoundariesInput">Show polygon boundaries</label>
        <br />

        <input
          id="showMassCentersInput"
          type="checkbox"
          onChange={toggleCheckbox('showMassCenters')}
          checked={showMassCenters}
        />
        <label htmlFor="showMassCentersInput">Show mass centers</label>
        <br />

        <input
          id="showTracksInput"
          type="checkbox"
          onChange={toggleCheckbox('showTracks')}
          checked={showTracks}
        />
        <label htmlFor="showTracksInput">Show tracks</label>
        <br />

        <input
          id="showBeaconSignalAreaInput"
          type="checkbox"
          onChange={toggleCheckbox('showBeaconSignalArea')}
          checked={showBeaconSignalArea}
        />
        <label htmlFor="showBeaconSignalAreaInput">Show beacon signal area</label>
        <br />
        <div>
          <label>Signal radius</label>
          <br />
          <input type="number" value={signalRadius} onChange={onStateChange('signalRadius', Number)} />
        </div>

      </div>
      <div className="margin-1rem">
        <input
          id="enableAutoIterationInput"
          type="checkbox"
          onChange={toggleCheckbox('enableAutoIteration')}
          checked={enableAutoIteration}
        />
        <label htmlFor="enableAutoIterationInput">Enable auto iteration</label>
        <br />
        <Button
          variant="primary"
          onClick={nextIteration}
        >
            Next iteration
        </Button>

        <div>
          <label>Delta (stop condition)</label>
          <br />
          <input type="number" value={maxDelta} onChange={onStateChange('maxDelta', Number)} />
        </div>
      </div>
      <div className="margin-1rem">
        <Button
          variant="primary"
          onClick={clearPolygon}
          className="margin-right-1rem margin-bottom-1rem"
        >
            Clear main polygon
        </Button>
        <br />
        <Button
          variant="primary"
          onClick={clearBeacons}
          className="margin-right-1rem margin-bottom-1rem"
        >
            Clear beacons
        </Button>
        <br />
        <Button
          variant="primary"
          onClick={clearTracks}
          className="margin-right-1rem margin-bottom-1rem"
        >
            Clear tracks
        </Button>
        <br />


      </div>
    </div>


  );
}

SettingsForm.propTypes = SettingsFormPropTypes;
