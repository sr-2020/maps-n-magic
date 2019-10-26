import { getBeacons } from '../../data/beacons';

export default class DataService {
  constructor() {
    const beacons = localStorage.getItem('beacons');
    this.beacons = beacons ? JSON.parse(beacons) : getBeacons();
    const locations = localStorage.getItem('locations');
    this.locations = locations ? JSON.parse(locations) : [];
  }

  getBeacons = function () {
    return this.beacons;
  }

  setBeacons = function (beacons) {
    localStorage.setItem('beacons', JSON.stringify(beacons));
    this.beacons = beacons;
  }

  getLocations = function () {
    return this.locations;
  }

  setLocations = function (locations) {
    localStorage.setItem('locations', JSON.stringify(locations));
    this.locations = locations;
  }
}
