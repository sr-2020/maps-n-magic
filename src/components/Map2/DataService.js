import * as R from 'ramda';
import { getBeacons, getBeacons2 } from '../../data/beacons';


export default class DataService {
  constructor() {
    const beacons = localStorage.getItem('beacons');
    this.beacons = beacons ? JSON.parse(beacons) : getBeacons2();
    this.maxBeaconId = R.reduce(R.max, 1, this.beacons.map(R.prop('id')));
    const locations = localStorage.getItem('locations');
    this.locations = locations ? JSON.parse(locations) : [];
    this.maxLocationId = R.reduce(R.max, 1, this.locations.map(R.prop('id')));
  }

  getBeacons = function () {
    return this.beacons;
  }

  putBeacon = (id, props) => {
    const index = this.beacons.findIndex(beacon => beacon.id === id);
    this.beacons[index] = {
      ...this.beacons[index],
      ...props,
      id
    };
    this._saveBeacons();
  }

  postBeacon = props => {
    this.maxBeaconId++;
    this.beacons.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });
    this._saveBeacons();
    return this.beacons[this.beacons.length - 1];
  }

  deleteBeacon = id => {
    this.beacons = this.beacons.filter(beacon => beacon.id !== id);
    this._saveBeacons();
  }

  _saveBeacons = function () {
    localStorage.setItem('beacons', JSON.stringify(this.beacons));
  }

  getLocations = function () {
    return this.locations;
  }

  putLocation = (id, props) => {
    const index = this.locations.findIndex(loc => loc.id === id);
    this.locations[index] = {
      ...this.locations[index],
      ...props,
      id
    };
    this._saveLocations();
  }

  postLocation = props => {
    this.maxLocationId++;
    this.locations.push({
      ...props,
      markers: [],
      id: this.maxLocationId,
      name: String(this.maxLocationId),
    });
    this._saveLocations();
    return this.locations[this.locations.length - 1];
  }

  deleteLocation = id => {
    this.locations = this.locations.filter(loc => loc.id !== id);
    this._saveLocations();
  }

  _saveLocations = function () {
    localStorage.setItem('locations', JSON.stringify(this.locations));
  }

  getAttachedBeaconIds = () => {
    const allArrs = this.locations.map(loc => loc.markers);
    return R.uniq(R.flatten(allArrs));
  }
}
