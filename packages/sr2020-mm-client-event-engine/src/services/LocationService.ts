// import * as R from 'ramda';

// import { initialLocations } from 'sr2020-mm-data/assets/locations';

// import { AbstractService } from 'sr2020-mm-event-engine';

// const metadata = {
//   actions: ['postLocation', 'deleteLocation', 'putLocation'],
//   requests: ['locations', 'attachedBeaconIds'],
//   emitEvents: ['postLocation', 'deleteLocation', 'putLocation'],
//   listenEvents: [],
// };
// export class LocationService extends AbstractService {
//   locations: any;
//   maxLocationId: any;

//   constructor(logger) {
//     super(logger);
//     this.setMetadata(metadata);
//     this.locations = initialLocations;
//     this.locations.forEach((location) => {
//       if (!location.manaLevel) {
//         location.manaLevel = 'normal';
//       }
//     });
//     this.maxLocationId = 1;
//   }

//   // @ts-ignore
//   setData({ locations } = {}) {
//     this.locations = locations || initialLocations;
//     this.locations.forEach((location) => {
//       if (!location.manaLevel) {
//         location.manaLevel = 'normal';
//       }
//     });
//     this.maxLocationId = R.reduce(R.max, 1, this.locations.map(R.prop('id')));
//   }

//   getData() {
//     return {
//       locations: this.getLocations(),
//     };
//   }

//   getLocations() {
//     return this.locations;
//   }

//   putLocation({ id, props }) {
//     const index = this.locations.findIndex((loc) => loc.id === id);
//     this.locations[index] = {
//       ...this.locations[index],
//       ...props,
//       id,
//     };
//     this.emit('putLocation', this.locations[index]);
//   }

//   postLocation({ props }) {
//     this.maxLocationId++;
//     this.locations.push({
//       ...props,
//       markers: [],
//       manaLevel: 'normal',
//       id: this.maxLocationId,
//       name: String(this.maxLocationId),
//     });
//     const location = this.locations[this.locations.length - 1];
//     this.emit('postLocation', location);
//     return location;
//   }

//   deleteLocation({ id }) {
//     const index = this.locations.findIndex((location) => location.id === id);
//     const location = this.locations[index];
//     this.locations = R.remove(index, 1, this.locations);
//     this.emit('deleteLocation', location);
//     return location;
//   }

//   getAttachedBeaconIds() {
//     const allArrs = this.locations.map((loc) => loc.markers);
//     return R.uniq(R.flatten(allArrs));
//   }

//   // on(...args) {
//   //   const res = super.on.apply(this, args);
//   //   console.log('on', getEeStats(this));
//   //   return res;
//   // }

//   // off(...args) {
//   //   const res = super.off.apply(this, args);
//   //   console.log('off', getEeStats(this));
//   //   return res;
//   // }
// }
