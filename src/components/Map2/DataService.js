import * as R from 'ramda';
import { getBeacons, getBeacons2 } from '../../data/beacons';


export default class DataService {
  constructor() {
    const beacons = localStorage.getItem('beacons');
    this.beacons = beacons ? JSON.parse(beacons) : getBeacons();
    const beacons2 = localStorage.getItem('beacons2');
    this.beacons2 = beacons2 ? JSON.parse(beacons2) : getBeacons2();
    // this.beacons2 = getBeacons2();
    this.maxBeaconId = R.reduce(R.max, 0, this.beacons2.map(R.prop('id')));
    // console.log('this.maxBeaconId', this.maxBeaconId);
    const locations = localStorage.getItem('locations');
    this.locations = locations ? JSON.parse(locations) : [];
  }

  getBeacons = function () {
    return this.beacons;
  }

  getBeacons2 = function () {
    return this.beacons2;
  }

  putBeacon = (id, props) => {
    const index = this.beacons2.findIndex(beacon => beacon.id === id);
    this.beacons2[index] = {
      ...this.beacons2[index],
      ...props,
      id
    };
    this.saveBeacons2();
  }

  postBeacon = props => {
    this.maxBeaconId++;
    this.beacons2.push({
      ...props,
      id: this.maxBeaconId,
      name: String(this.maxBeaconId),
    });
    this.saveBeacons2();
    return this.beacons2[this.beacons2.length - 1];
  }

  deleteBeacon = id => {
    this.beacons2 = this.beacons2.filter(beacon => beacon.id !== id);
    this.saveBeacons2();
  }

  setBeacons = function (beacons) {
    localStorage.setItem('beacons', JSON.stringify(beacons));
    this.beacons = beacons;
  }

  saveBeacons2 = function () {
    localStorage.setItem('beacons2', JSON.stringify(this.beacons2));
    // this.beacons = beacons;
  }

  getLocations = function () {
    return this.locations;
  }

  setLocations = function (locations) {
    localStorage.setItem('locations', JSON.stringify(locations));
    this.locations = locations;
  }
}
