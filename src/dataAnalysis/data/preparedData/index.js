import * as R from 'ramda';

import tracksData from './pt6.json';

import beaconLatlngs from './googleMapBeaconList.json';

import beaconTable from './postgresBeaconTable.json';

import {
  Girt, Ksotar, Eremin_sync_Ksotar, Gurkalov_sync_Ksotar, Radomir,
} from '../gps_15_sept';

const beaconIndex = R.indexBy(R.prop('id'), beaconTable);

const beaconLatlngsIndex = R.indexBy(R.prop('id'), beaconLatlngs);

// inject gps data
tracksData['157'].gpsTrack = Radomir;
tracksData['160'].gpsTrack = Ksotar;
tracksData['5'].gpsTrack = Girt;
tracksData['130'].gpsTrack = Eremin_sync_Ksotar;
tracksData['127'].gpsTrack = Gurkalov_sync_Ksotar;

const makeUserList = R.pipe(
  R.mapObjIndexed(R.path(['userData', 'name'])),
  R.toPairs,
  R.map(R.zipObj(['userId', 'userName'])),
);
const sortByName = R.sortBy(R.pipe(R.prop('userName'), R.toLower));
const userList = R.pipe(makeUserList, sortByName)(tracksData);

export {
  tracksData, beaconLatlngs, beaconTable, userList, beaconLatlngsIndex, beaconIndex,
};
