export class UserService {
  metadata = {
    actions: ['updateUserPosition'],
    getters: [],
    events: ['userPositionUpdate'],
  };

  constructor(gameModel) {
    this.gameModel = gameModel;
    this.user = {
      pos: null, // based on position from leaflet
    };
  }

  dispatch(action, onDefaultAction) {
    if (action.type === 'updateUserPosition') {
      this._setUserPosition(action.pos);
      return;
    }
    onDefaultAction(action);
  }

  _setUserPosition(pos) {
    this.user.pos = pos;
    this.gameModel.emit('userPositionUpdate', this.user);
  }
}
