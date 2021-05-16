import { 
  GameModel,
  GMLogger,
  // ForwardServer2Client events
  ELocationRecordsChanged2,
  EBeaconRecordsChanged2,
  ESettingsChanged,
  EPostNotification,
  ECharacterHealthStateChanged,
  ECharacterHealthStatesLoaded,
  EEnableManaOceanChanged,
  EUserRecordsChanged,
  ESetSettingsCatalog,
  ECharacterLocationChanged,
  // error and forwarding notification
  PostNotification,
  // executed actions from server 2 client
  SetLocationRecords,
  SetBeaconRecords,
  SetSettings,
  // PutCharHealthConfirmed,
  // SetCharacterHealthStates,
  EPutCharHealthConfirmed,
  ESetCharacterHealthStates,
  // EnableManaOceanConfirmed,
  EEnableManaOceanConfirmed,
  SetUserRecords,
  // executed actions from client 2 server
  EPostLocationRecordRequested,
  EPutLocationRecordRequested,
  EPutLocationRecordsRequested,
  EDeleteLocationRecordRequested,
  EPostBeaconRecordRequested,
  EPutBeaconRecordRequested,
  EDeleteBeaconRecordRequested,
  EPostSettingsRequested,
  EPutCharHealthRequested,
  EEnableManaOceanRequested,
  EWipeManaOceanEffects,
  ERemoveManaEffect,
  EAddManaEffect,
  // not event, seems not used, need to check
  EEmitCharacterLocationChanged,
  // 'emitCharacterLocationChanged',
  EReloadUserRecords,

  //???
  // characterLocationChanged
  AbstractEventProcessor
} from "sr2020-mm-event-engine";

import { TrackedCharacterLocationChanged } from "../index";

import { WSConnector } from '../api/WSConnector';

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type ForwardServer2ClientEvent = 
  ELocationRecordsChanged2 |
  EBeaconRecordsChanged2 |
  ESettingsChanged |
  EPostNotification |
  ECharacterHealthStateChanged |
  ECharacterHealthStatesLoaded |
  EEnableManaOceanChanged |
  EUserRecordsChanged |
  ECharacterLocationChanged |
  ESetSettingsCatalog;

// In reality this is event list, not actions.
const forwardServer2ClientActions = [
  'locationRecordsChanged2',
  'beaconRecordsChanged2',
  // 'manaOceanSettingsChanged',
  'settingsChanged',
  'postNotification',
  'characterHealthStateChanged',
  'characterHealthStatesLoaded',
  'enableManaOceanChanged',
  'setSettingsCatalog',
  'characterLocationChanged',
  'userRecordsChanged',
  // 'characterHealthStateChanged',
];

type ForwardClient2ServerEventTypes = 
  EPostLocationRecordRequested["type"] |
  EPutLocationRecordRequested["type"] |
  EPutLocationRecordsRequested["type"] |
  EDeleteLocationRecordRequested["type"] |
  EPostBeaconRecordRequested["type"] |
  EPutBeaconRecordRequested["type"] |
  EDeleteBeaconRecordRequested["type"] |
  EPostSettingsRequested["type"] |
  EPutCharHealthRequested["type"] |
  EEnableManaOceanRequested["type"] |
  EWipeManaOceanEffects["type"] |
  ERemoveManaEffect["type"] |
  EAddManaEffect["type"] |
  EEmitCharacterLocationChanged["type"] |
  // not event
  EReloadUserRecords["type"];

// TODO try to get list of event types from event type interfaces
const forwardClient2ServerEvents: ForwardClient2ServerEventTypes[] = [
  'postLocationRecordRequested',
  'putLocationRecordRequested',
  'putLocationRecordsRequested',
  'deleteLocationRecordRequested',
  'postBeaconRecordRequested',
  'putBeaconRecordRequested',
  'deleteBeaconRecordRequested',
  // 'postManaOceanSettingsRequested',
  'postSettingsRequested',
  'putCharHealthRequested',
  'enableManaOceanRequested',
  'wipeManaOceanEffects',
  'removeManaEffect',
  'addManaEffect',
  'emitCharacterLocationChanged',
  'reloadUserRecords',
];

export class WsDataBinding extends AbstractEventProcessor {
  constructor(
    protected gameModel: GameModel, 
    private wsConnection: WSConnector,
    protected logger: GMLogger
  ) {
    super(gameModel, logger);
    // this.entityName = entityName;
    // this.plural = `${entityName}s`;
    // this.ccEntityName = capitalizeFirstLetter(entityName);
    this.sendToServer = this.sendToServer.bind(this);
    this.initClientConfig = this.initClientConfig.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.subscribe('on', this.gameModel);
    this.subscribeWsConnection('on', this.wsConnection);
    this.initClientConfig();
    this.setMetadata({
      emitEvents: forwardClient2ServerEvents,
      listenEvents: forwardServer2ClientActions
    });
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
        type: 'setSettingsCatalog',
        // type: 'settingsChanged',
        payload: 'settingsCatalog',
      // }, {
      //   type: 'manaOceanSettingsChanged',
      //   payload: 'manaOceanSettings',
      }, {
        type: 'characterHealthStatesLoaded',
        payload: 'characterHealthStates',
      }, {
        type: 'enableManaOceanChanged',
        payload: 'enableManaOcean',
      }, {
        type: 'userRecordsChanged',
        payload: 'userRecords',
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

  subscribe(action: 'on' | 'off', gameModel: GameModel) {
    forwardClient2ServerEvents.forEach((eventName) => gameModel[action](eventName, this.sendToServer));
  }

  subscribeWsConnection(action: 'on' | 'off', wsConnection: WSConnector) {
    wsConnection[action]('onOpen', this.initClientConfig);
    wsConnection[action]('onMessage', this.onMessage);
  }

  // eslint-disable-next-line max-lines-per-function
  onMessage(data: ForwardServer2ClientEvent) {
    const { type } = data;
    if (!forwardServer2ClientActions.includes(type)) {
      this.logger.error('Unexpected action:', type, ', expected actions list:', forwardServer2ClientActions);
      this.gameModel.execute2<PostNotification>({
        type: 'postNotification',
        title: 'Unexpected event: ' + type,
        message: `Recieved unexpected event from server. Event is ignored.`,
        kind: 'error',
      })
      return;
    }

    if (data.type === 'locationRecordsChanged2') {
      this.gameModel.execute2<SetLocationRecords>({
        ...data,
        type: 'setLocationRecords',
      });
    }

    if (data.type === 'beaconRecordsChanged2') {
      this.gameModel.execute2<SetBeaconRecords>({
        ...data,
        type: 'setBeaconRecords',
      });
    }

    // This is synthetic transformation for transferring settings from server to client.
    // We take all settings from server and transform it setSettings event sequence.
    // Current settings implementation works with settings set separately.
    // So transforming it to sequence is logical - we don't have batch settings processing now.
    if (data.type === 'setSettingsCatalog') {
      const { settingsCatalog } = data;
      Object.keys(settingsCatalog).forEach(name => {
        this.gameModel.execute2<SetSettings>({
          type: 'setSettings',
          // TODO - think about better settings structure
          // @ts-ignore
          name,
          settings: settingsCatalog?.[name],
        });
      })
    }

    if (data.type === 'settingsChanged') {
      const { name, settingsCatalog } = data;
      if (name && settingsCatalog) {
        this.gameModel.execute2<SetSettings>({
          type: 'setSettings',
          name,
          // TODO - think about better settings structure
          // @ts-ignore
          settings: settingsCatalog?.[name],
        });
      }
    }
    // if (type === 'manaOceanSettingsChanged') {
    //   this.gameModel.execute({
    //     ...data,
    //     type: 'setManaOceanSettings',
    //   });
    // }

    if (data.type === 'characterHealthStateChanged') {
      // this.gameModel.execute2<PutCharHealthConfirmed>({
      this.gameModel.emit2<EPutCharHealthConfirmed>({
        ...data,
        type: 'putCharHealthConfirmed',
      });
    }

    if (data.type === 'characterHealthStatesLoaded') {
      // this.gameModel.execute2<SetCharacterHealthStates>({
      this.gameModel.emit2<ESetCharacterHealthStates>({
        ...data,
        type: 'setCharacterHealthStates',
      });
    }

    if (data.type === 'enableManaOceanChanged') {
      // this.gameModel.execute2<EnableManaOceanConfirmed>({
      this.gameModel.emit2<EEnableManaOceanConfirmed>({
        ...data,
        type: 'enableManaOceanConfirmed',
      });
    }

    if (data.type === 'userRecordsChanged') {
      this.gameModel.execute2<SetUserRecords>({
        ...data,
        type: 'setUserRecords',
      });
    }

    if (data.type === 'characterLocationChanged') {
      this.gameModel.execute2<TrackedCharacterLocationChanged>({
        ...data,
        type: "trackedCharacterLocationChanged"
      });
    }

    // 'characterHealthStateChanged',
    // 'characterHealthStatesLoaded'

    if (data.type === 'postNotification') {
      this.gameModel.execute2<PostNotification>(data);
    }

    // console.log('onMessage', data);
  }

  private sendToServer(action: unknown) {
    this.wsConnection.send(action);
  }
}
