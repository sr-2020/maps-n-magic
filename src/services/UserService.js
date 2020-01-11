import { AbstractService } from './AbstractService';

export class UserService extends AbstractService {
  metadata = {
    actions: ['updateUserPosition'],
    emitEvents: ['userPositionUpdate'],
  };

  constructor() {
    super();
    this.user = {
      pos: null, // based on position from leaflet
    };
  }

  execute(action, onDefaultAction) {
    if (action.type === 'updateUserPosition') {
      return this._setUserPosition(action.pos);
    }
    return onDefaultAction(action);
  }

  _setUserPosition(pos) {
    this.user.pos = pos;
    this.emit('userPositionUpdate', this.user);
  }
}
