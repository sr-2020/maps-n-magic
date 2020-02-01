import { AbstractService } from './AbstractService';

export class UserService extends AbstractService {
  metadata = {
    actions: ['updateUserPosition'],
    requests: ['user'],
    emitEvents: ['userPositionUpdate'],
  };

  constructor() {
    super();
    this.user = {
      pos: null, // based on position from leaflet
    };
  }

  updateUserPosition({ pos }) {
    this.user.pos = pos;
    this.emit('userPositionUpdate', { user: this.user });
  }

  getUser() {
    return this.user;
  }
}
