// import { AbstractService } from 'sr2020-mm-event-engine';

// const metadata = {
//   actions: ['updateUserPosition'],
//   requests: ['user'],
//   emitEvents: ['userPositionUpdate'],
// };
// export class UserService extends AbstractService {
//   user: any;

//   constructor(logger) {
//     super(logger);
//     this.setMetadata(metadata);
//     this.user = {
//       pos: null, // based on position from leaflet
//     };
//   }

//   updateUserPosition({ pos }) {
//     this.user.pos = pos;
//     this.emit('userPositionUpdate', { user: this.user });
//   }

//   getUser() {
//     return this.user;
//   }
// }
