export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const forwardServer2ClientActions = [
  'locationRecordsChanged2',
  'beaconRecordsChanged2',
  'manaOceanSettingsChanged',
  'postNotification',
  'characterHealthStateChanged',
  'characterHealthStatesLoaded',
  'enableManaOceanChanged',
  // 'characterHealthStateChanged',
];

const forwardClient2ServerActions = [
  'postLocationRecordRequested',
  'putLocationRecordRequested',
  'putLocationRecordsRequested',
  'deleteLocationRecordRequested',
  'postBeaconRecordRequested',
  'putBeaconRecordRequested',
  'deleteBeaconRecordRequested',
  'postManaOceanSettingsRequested',
  'putCharHealthRequested',
  'enableManaOceanRequested',
  'wipeManaOceanEffects',
  'removeManaEffect',
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
      }, {
        type: 'characterHealthStatesLoaded',
        payload: 'characterHealthStates',
      }, {
        type: 'enableManaOceanChanged',
        payload: 'enableManaOcean',
      }],
      forwardActions: forwardServer2ClientActions,
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
    forwardClient2ServerActions.forEach((eventName) => gameModel[action](eventName, this.emit));
  }

  subscribeWsConnection(action, wsConnection) {
    wsConnection[action]('onOpen', this.initClientConfig);
    wsConnection[action]('onMessage', this.onMessage);
  }

  onMessage(data) {
    const { type } = data;
    if (!forwardServer2ClientActions.includes(type)) {
      console.error('Unexpected action:', type, ', expected actions list:', forwardServer2ClientActions);
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

    if (type === 'characterHealthStateChanged') {
      this.gameModel.execute({
        ...data,
        type: 'putCharHealthConfirmed',
      });
    }

    if (type === 'characterHealthStatesLoaded') {
      this.gameModel.execute({
        ...data,
        type: 'setCharacterHealthStates',
      });
    }

    if (type === 'enableManaOceanChanged') {
      this.gameModel.execute({
        ...data,
        type: 'enableManaOceanConfirmed',
      });
    }

    // 'characterHealthStateChanged',
    // 'characterHealthStatesLoaded'

    if (type === 'postNotification') {
      this.gameModel.execute(data);
    }

    // console.log('onMessage', data);
  }

  emit(action) {
    this.wsConnection.send(action);
  }
}
