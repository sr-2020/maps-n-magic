export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const forwardActions = [
  'locationRecordsChanged2',
  'beaconRecordsChanged2',
  'manaOceanSettingsChanged',
];

export class WsDataBinding {
  constructor({
    gameModel, entityName, wsConnection,
  }) {
    this.gameModel = gameModel;
    this.wsConnection = wsConnection;
    // this.entityName = entityName;
    // this.plural = `${entityName}s`;
    // this.ccEntityName = capitalizeFirstLetter(entityName);
    this.emit = this.emit.bind(this);
    this.initClientConfig = this.initClientConfig.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.subscribe('on', this.gameModel);
    this.subscribeWsConnection('on', this.wsConnection);
    this.initClientConfig();
  }

  initClientConfig() {
    const hasError = this.wsConnection.send({
      message: 'initClientConfig',
      data: [{
        type: 'locationRecordsChanged2',
        payload: 'locationRecords',
      }, {
        type: 'beaconRecordsChanged2',
        payload: 'beaconRecords',
      }, {
        type: 'manaOceanSettingsChanged',
        payload: 'manaOceanSettings',
      }],
      forwardActions,
    });
    // if (hasError) {
    //   setTimeout(this.initClientConfig, 1000);
    // }
  }

  dispose() {
    // super.dispose();
    this.subscribe('off', this.gameModel);
    this.subscribeWsConnection('off', this.wsConnection);
  }

  subscribe(action, gameModel) {
    const arrList = [
      'postLocationRecordRequested',
      'putLocationRecordRequested',
      'putLocationRecordsRequested',
      'deleteLocationRecordRequested',
      'postBeaconRecordRequested',
      'putBeaconRecordRequested',
      'deleteBeaconRecordRequested',
      'postManaOceanSettingsRequested',
    ];
    arrList.forEach((eventName) => gameModel[action](eventName, this.emit));
  }

  subscribeWsConnection(action, wsConnection) {
    wsConnection[action]('onOpen', this.initClientConfig);
    wsConnection[action]('onMessage', this.onMessage);
  }

  onMessage(data) {
    const { type } = data;
    if (!forwardActions.includes(type)) {
      console.error('Unexpected action:', type, ', expected actions list:', forwardActions);
      return;
    }

    if (type === 'locationRecordsChanged2') {
      this.gameModel.execute({
        ...data,
        type: 'setLocationRecords',
      });
    }

    if (type === 'beaconRecordsChanged2') {
      this.gameModel.execute({
        ...data,
        type: 'setBeaconRecords',
      });
    }

    if (type === 'manaOceanSettingsChanged') {
      this.gameModel.execute({
        ...data,
        type: 'setManaOceanSettings',
      });
    }

    // console.log('onMessage', data);
  }

  emit(action) {
    this.wsConnection.send(action);
  }
}
