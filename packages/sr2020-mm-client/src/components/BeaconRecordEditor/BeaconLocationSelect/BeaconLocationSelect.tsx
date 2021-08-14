import React, { ChangeEvent } from 'react';
import './BeaconLocationSelect.css';

import { WithTranslation } from "react-i18next";

import Form from 'react-bootstrap/Form';
import { BeaconRecord, GameModel } from 'sr2020-mm-event-engine';

import { WithGeoLocationRecords } from '../../../dataHOCs';

interface BeaconLocationSelectProps extends WithTranslation, WithGeoLocationRecords {
  gameModel: GameModel;
  beacon: BeaconRecord;
  onLocationSelect: (beaconId: number, locationId: number | null) => void;
}

export function BeaconLocationSelect(props: BeaconLocationSelectProps) {
  const { t, beacon, geoLocationRecords, onLocationSelect } = props;

  if (geoLocationRecords.length === 0) {
    return <div>{t('geoLocationsNotFound')}</div>;
  }

  function onLocationSelect1(event: ChangeEvent<HTMLSelectElement>): void {
    const { value } = event.target;
    const { idStr } = event.target.dataset;
    const newValue = value === 'beaconHasNoLocation' ? null : Number(value);
    onLocationSelect(Number(idStr), newValue);
  }

  return (
    <Form.Control 
      className="BeaconLocationSelect"
      as="select" 
      defaultValue={beacon.location_id !== null ? beacon.location_id : undefined} 
      data-id-str={beacon.id} 
      onChange={onLocationSelect1}
    >
      <option value="beaconHasNoLocation">{t('beaconHasNoLocation')}</option>
      {
        geoLocationRecords.map((location) => (
          <option
            key={location.id}
            value={location.id}
          >
            {`${location.label} (${location.id})`}
          </option>
        ))
      }
    </Form.Control>
  );
}



