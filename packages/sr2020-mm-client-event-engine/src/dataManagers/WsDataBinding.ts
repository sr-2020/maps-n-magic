import { 
  GameModel,
  GMLogger,
  // ForwardServer2Client events
  ESettingsChanged,
  EPostNotification,
  ECharacterHealthStateChanged,
  ECharacterHealthStatesLoaded,
  EEnableManaOceanChanged,
  EEnableSpiritMovementChanged,
  EUserRecordsChanged,
  ESetSettingsCatalog,
  ECharacterLocationChanged,
  // error and forwarding notification
  // PostNotification,
  // executed actions from server 2 client
  SetLocationRecords,
  SetBeaconRecords,
  SetSettings,
  // PutCharHealthConfirmed,
  // SetCharacterHealthStates,
  EPutCharHealthConfirmed,
  ESetCharacterHealthStates,
  EEnableManaOceanConfirmed,
  EEnableSpiritMovementConfirmed,
  SetUserRecords,
  // executed actions from client 2 server
  // locations
  EPostLocationRecordRequested,
  EPutLocationRecordRequested,
  EPutLocationRecordsRequested,
  EDeleteLocationRecordRequested,
  ELocationRecordsChanged2,
  // beacons
  EPostBeaconRecordRequested,
  EPutBeaconRecordRequested,
  EDeleteBeaconRecordRequested,
  EBeaconRecordsChanged2,
  // spirits
  EPostSpiritRequested,
  EPutSpiritRequested,
  EDeleteSpiritRequested,
  ESetSpirits,
  ESpiritsChanged,
  GetSpirits,
  // spirit fractions
  EPutSpiritFractionRequested,
  ESetSpiritFractions,
  ESpiritFractionsChanged,
  GetSpiritFractions,
  // spirit route
  EPostSpiritRouteRequested,
  EPutSpiritRouteRequested,
  EDeleteSpiritRouteRequested,
  ESetSpiritRoutes,
  ESpiritRoutesChanged,
  GetSpiritRoutes,
  // misc
  EPostSettingsRequested,
  EPutCharHealthRequested,
  EEnableManaOceanRequested,
  EEnableSpiritMovementRequested,
  EWipeManaOceanEffects,
  ERemoveManaEffect,
  EAddManaEffect,
  // not event, seems not used, need to check
  EEmitCharacterLocationChanged,
  // 'emitCharacterLocationChanged',
  EReloadUserRecords,
  //???
  // characterLocationChanged
  AbstractEventProcessor,
  GMEvent,
  RequestHandler,
  Req,
  Res,
  TypeOnly,
  GetLocationRecords,
  GetBeaconRecords,
  GetSettingsCatalog,
  GetCharacterHealthStates,
  GetEnableManaOcean,
  GetUserRecords,
  GetEnableSpiritMovement,

} from "sr2020-mm-event-engine";

import { TrackedCharacterLocationChanged } from "../index";

import { WSConnector } from '../api/WSConnector';

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type ForwardServer2ClientEvent = 
  | ELocationRecordsChanged2
  | EBeaconRecordsChanged2
  | ESpiritsChanged
  | ESpiritFractionsChanged
  | ESpiritRoutesChanged

  | ESettingsChanged
  | EPostNotification
  | ECharacterHealthStateChanged
  | ECharacterHealthStatesLoaded
  | EEnableManaOceanChanged

  | EUserRecordsChanged
  | ECharacterLocationChanged
  | ESetSettingsCatalog
  | EEnableSpiritMovementChanged
;

// In reality this is event list, not actions.
const forwardServer2ClientActions: ForwardServer2ClientEvent["type"][] = [
  'locationRecordsChanged2',
  'beaconRecordsChanged2',
  'spiritsChanged',
  // 'manaOceanSettingsChanged',
  'settingsChanged',
  'postNotification',

  'characterHealthStateChanged',
  'characterHealthStatesLoaded',
  'enableManaOceanChanged',
  'setSettingsCatalog',
  'characterLocationChanged',

  'userRecordsChanged',
  'spiritFractionsChanged',
  'spiritRoutesChanged',
  'enableSpiritMovementChanged'
  // 'characterHealthStateChanged',
];

type WsEmitEvent = 
  | EPostNotification
  | ESetSpirits
  | ESetSpiritFractions
  | ESetSpiritRoutes
  | EPutCharHealthConfirmed
  | ESetCharacterHealthStates
  | EEnableManaOceanConfirmed
  | EEnableSpiritMovementConfirmed
;

const wsEmitEvents: WsEmitEvent["type"][] = [
  'postNotification',
  "enableManaOceanConfirmed",
  "enableSpiritMovementConfirmed",
  "putCharHealthConfirmed",
  "setCharacterHealthStates",
  "setSpirits",
  "setSpiritFractions",
  "setSpiritRoutes",
];

type ForwardClient2ServerEventTypes = (
  // locations
  | EPostLocationRecordRequested
  | EPutLocationRecordRequested
  | EPutLocationRecordsRequested
  | EDeleteLocationRecordRequested
  // beacons
  | EPostBeaconRecordRequested
  | EPutBeaconRecordRequested
  | EDeleteBeaconRecordRequested
  | EPostSettingsRequested
  // spirits
  | EPostSpiritRequested
  | EPutSpiritRequested
  | EDeleteSpiritRequested
  // spirit fractions
  | EPutSpiritFractionRequested
  // spirits
  | EPostSpiritRouteRequested
  | EPutSpiritRouteRequested
  | EDeleteSpiritRouteRequested
  // misc
  | EPutCharHealthRequested
  | EEnableManaOceanRequested
  | EEnableSpiritMovementRequested
  | EWipeManaOceanEffects
  | ERemoveManaEffect
  | EAddManaEffect
  | EEmitCharacterLocationChanged
  // not event
  | EReloadUserRecords
)["type"];

// TODO try to get list of event types from event type interfaces
const forwardClient2ServerEvents: ForwardClient2ServerEventTypes[] = [
  // locations
  'postLocationRecordRequested',
  'putLocationRecordRequested',
  'putLocationRecordsRequested',
  'deleteLocationRecordRequested',
  // beacons
  'postBeaconRecordRequested',
  'putBeaconRecordRequested',
  'deleteBeaconRecordRequested',
  // spirits
  'postSpiritRequested',
  'putSpiritRequested',
  'deleteSpiritRequested',
  // spirit fractions
  'putSpiritFractionRequested',
  // spirit routes
  'postSpiritRouteRequested',
  'putSpiritRouteRequested',
  'deleteSpiritRouteRequested',
  // 'postManaOceanSettingsRequested',
  'postSettingsRequested',
  'putCharHealthRequested',
  'enableManaOceanRequested',
  'enableSpiritMovementRequested',
  'wipeManaOceanEffects',
  'removeManaEffect',
  'addManaEffect',
  'emitCharacterLocationChanged',
  'reloadUserRecords',
];

export type PayloadToEventBinding<
  PayloadHandler extends RequestHandler<[TypeOnly]>,
  ToEvent extends GMEvent & {
    [key in ReqValue]: ResValue
  },
  ReqValue extends string = Req<PayloadHandler>,
  ResValue = Res<PayloadHandler>
> = {
  type: ToEvent["type"],
  payload: Req<PayloadHandler>
};

type PayloadToEventBindings = 
  | PayloadToEventBinding<GetLocationRecords, ELocationRecordsChanged2>
  | PayloadToEventBinding<GetBeaconRecords, EBeaconRecordsChanged2>
  | PayloadToEventBinding<GetSettingsCatalog, ESetSettingsCatalog>
  | PayloadToEventBinding<GetCharacterHealthStates, ECharacterHealthStatesLoaded>
  | PayloadToEventBinding<GetEnableManaOcean, EEnableManaOceanChanged>
  | PayloadToEventBinding<GetUserRecords, EUserRecordsChanged>
  | PayloadToEventBinding<GetSpirits, ESpiritsChanged>
  | PayloadToEventBinding<GetSpiritFractions, ESpiritFractionsChanged>
  | PayloadToEventBinding<GetSpiritRoutes, ESpiritRoutesChanged>
  | PayloadToEventBinding<GetEnableSpiritMovement, EEnableSpiritMovementChanged>
;

interface InitClientConfigMessage {
  message: 'initClientConfig';
  data: PayloadToEventBindings[];
  forwardActions: string[];
}

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
      emitEvents: wsEmitEvents,
      listenEvents: forwardClient2ServerEvents 
    });
  }

  initClientConfig() {
    const initMessage: InitClientConfigMessage = {
      message: 'initClientConfig',
      // TODO consider replacing getter-event pairs by
      // trigger-event pairs for consistency
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
        type: 'enableSpiritMovementChanged',
        payload: 'enableSpiritMovement',
      }, {
        type: 'userRecordsChanged',
        payload: 'userRecords',
      }, {
        type: 'spiritsChanged',
        payload: 'spirits',
      }, {
        type: 'spiritFractionsChanged',
        payload: 'spiritFractions',
      }, {
        type: 'spiritRoutesChanged',
        payload: 'spiritRoutes',
      }],
      forwardActions: forwardServer2ClientActions,
    }
    const hasError = this.wsConnection.send(initMessage);
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
      this.gameModel.emit2<WsEmitEvent>({
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
      return;
    }

    if (data.type === 'beaconRecordsChanged2') {
      this.gameModel.execute2<SetBeaconRecords>({
        ...data,
        type: 'setBeaconRecords',
      });
      return;
    }

    if (data.type === 'spiritsChanged') {
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'setSpirits',
      });
      return;
    }

    if (data.type === 'spiritFractionsChanged') {
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'setSpiritFractions',
      });
      return;
    }

    if (data.type === 'spiritRoutesChanged') {
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'setSpiritRoutes',
      });
      return;
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
      return;
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
      return;
    }
    // if (type === 'manaOceanSettingsChanged') {
    //   this.gameModel.execute({
    //     ...data,
    //     type: 'setManaOceanSettings',
    //   });
    // }

    if (data.type === 'characterHealthStateChanged') {
      // this.gameModel.execute2<PutCharHealthConfirmed>({
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'putCharHealthConfirmed',
      });
      return;
    }

    if (data.type === 'characterHealthStatesLoaded') {
      // this.gameModel.execute2<SetCharacterHealthStates>({
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'setCharacterHealthStates',
      });
      return;
    }

    if (data.type === 'enableManaOceanChanged') {
      // this.gameModel.execute2<EnableManaOceanConfirmed>({
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'enableManaOceanConfirmed',
      });
      return;
    }

    if (data.type === 'enableSpiritMovementChanged') {
      // this.gameModel.execute2<EnableManaOceanConfirmed>({
      this.gameModel.emit2<WsEmitEvent>({
        ...data,
        type: 'enableSpiritMovementConfirmed',
      });
      return;
    }

    if (data.type === 'userRecordsChanged') {
      this.gameModel.execute2<SetUserRecords>({
        ...data,
        type: 'setUserRecords',
      });
      return;
    }

    if (data.type === 'characterLocationChanged') {
      this.gameModel.execute2<TrackedCharacterLocationChanged>({
        ...data,
        type: "trackedCharacterLocationChanged"
      });
      return;
    }

    // 'characterHealthStateChanged',
    // 'characterHealthStatesLoaded'

    if (data.type === 'postNotification') {
      this.gameModel.emit2<WsEmitEvent>(data);
      return;
    }

    // default
    this.logger.error('Action not processed:', type, ', expected actions list:', forwardServer2ClientActions);
    this.gameModel.emit2<WsEmitEvent>({
      type: 'postNotification',
      title: 'Action not processed: ' + type,
      message: `Recieved event from server. Event is ignored.`,
      kind: 'error',
    });

    // console.log('onMessage', data);
  }

  private sendToServer(action: unknown) {
    this.wsConnection.send(action);
  }
}
