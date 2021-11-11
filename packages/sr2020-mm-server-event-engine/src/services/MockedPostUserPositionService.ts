import * as R from 'ramda';

import { 
  AbstractService, 
  GMLogger,
  GameModel,
  fetchWithTimeout,
  Req,
  Res,
  ServiceContract,
  ServiceContractTypes,
  GetBeaconRecords,
  GetLocationRecords,
  GetUserRecords,
  SetUserRecords
} from 'sr2020-mm-event-engine';
import { mainServerConstants } from '../api/constants';
import { PostUserPosition } from './PostUserPositionService';

export interface MockedPostUserPositionServiceContract extends ServiceContract {
  Request: never;
  Action: PostUserPosition;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: SetUserRecords;
  NeedRequest: 
    | GetBeaconRecords 
    | GetLocationRecords
    | GetUserRecords
  ;
}

export const pupMetadata: ServiceContractTypes<MockedPostUserPositionServiceContract> = {
  requests: [
  ],
  actions: [
    'postUserPosition',
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [
    'setUserRecords'
  ],
  needRequests: [
    'beaconRecords',
    'locationRecords',
    'userRecords',
  ]
};

export class MockedPostUserPositionService extends AbstractService<MockedPostUserPositionServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async postUserPosition(request: Req<PostUserPosition>): Res<PostUserPosition> {
    const { characterId, ssid } = request;
    const beaconRecords = this.getFromModel2({
      type: 'beaconRecords'
    });
    const locationRecords = this.getFromModel2({
      type: 'locationRecords'
    });
    const userRecords = this.getFromModel2({
      type: 'userRecords'
    });
    const beaconRecord = beaconRecords.find(el => el.bssid === ssid || el.ssid === ssid);
    if ( beaconRecord === undefined ) { return; }
    const { location_id } = beaconRecord;
    if ( location_id == undefined ) { return; }
    const locationRecord = locationRecords.find(el => el.id === location_id);
    if ( locationRecord === undefined ) { return; }
    const userRecord = userRecords.find(el => el.id === characterId);
    if ( userRecord === undefined ) { return; }
    const userRecords2 = userRecords.map(el => {
      if(el.id !== characterId) {
        return el;
      }  
      return {
        ...el,
        location: R.clone(locationRecord),
        location_id: locationRecord.id
      };
    });

    this.executeOnModel2({
      type: 'setUserRecords',
      userRecords: userRecords2
    });

    return;
  }
}

