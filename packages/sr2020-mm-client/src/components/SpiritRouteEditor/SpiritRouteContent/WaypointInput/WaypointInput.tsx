import React, { Component, FormEvent, MouseEvent } from 'react';
import './WaypointInput.css';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';
import { GameModel, isGeoLocation, LocationRecord } from "sr2020-mm-event-engine";
import { WithTranslation } from "react-i18next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as R from 'ramda';

import { WithLocationRecords } from '../../../../dataHOCs';

// @ts-ignore
const sort = R.sortBy(R.pipe(R.prop('label'), R.toLower)) as (locations: LocationRecord[]) => LocationRecord[];

interface WaypointInputProps extends WithTranslation, WithLocationRecords {
  gameModel: GameModel;
  waypoints: number[];
  addWaypoint: (waypointId: number) => void;
  removeWaypoint: (waypointIndex: number) => void;
  className?: string;
}

export class WaypointInput extends Component<WaypointInputProps> {

  constructor(props: WaypointInputProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeWaypoint = this.removeWaypoint.bind(this);
  }

  onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    const { locationRecords, addWaypoint } = this.props;
    if (form.checkValidity() === true) {
      const waypointId = Number(form.newWaypoint.value.trim());

      const geoLocationIds = R.pluck('id', locationRecords.filter(isGeoLocation));
      if (geoLocationIds.includes(waypointId)) {
        addWaypoint(waypointId);
        form.newWaypoint.value = '';
      }
    }
  }

  removeWaypoint(e: MouseEvent<HTMLElement>) {
    const { waypointIndex } = e.currentTarget.dataset;
    const { removeWaypoint } = this.props;
    removeWaypoint(Number(waypointIndex));
  }

  render() {
    const { t, className, locationRecords, waypoints } = this.props;

    const geoLocations = sort(locationRecords.filter(isGeoLocation));

    const geoLocationsIndex = R.indexBy(R.prop('id'), geoLocations);

    const className2 = classNames('WaypointInput', className);
    return (
      <div className={className2}>
        <Form onSubmit={this.onSubmit}>
          <InputGroup className="tw-mb-3">
            <FormControl required id="newWaypoint" list="waypoints-datalist" />
            <InputGroup.Append>
              <Button type="submit" variant="outline-secondary">{t('addWaypoint')}</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <div className="tw-flex tw-flex-col tw-items-start">
          {waypoints.map((waypointId, i) => (
            <ButtonGroup key={waypointId} className="tw-mr-2 tw-mb-2 tw-flex-grow-0">
              <Button variant="secondary" className="tw-text-left">
                {`${geoLocationsIndex[waypointId]?.label || t('notAvailable')} (${waypointId})`}
              </Button>
              <Button 
                variant="secondary"
                data-waypoint-index={i}
                onClick={this.removeWaypoint}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </ButtonGroup>
          ))}
        </div>
        <datalist id="waypoints-datalist">
          {
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
            geoLocations.map((location) => <option key={location.id} value={location.id}>{`${location.label} (${location.id})`}</ option>)
          }
        </datalist>
      </div>
    );
  }
}
