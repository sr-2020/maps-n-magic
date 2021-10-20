import * as R from 'ramda';

import { 
  AbstractService, 
  Metadata,
  GMLogger,
  GameModel,
  Typed,
  ServiceContract,
  ServiceContractTypes,
  fetchWithTimeout,
  Req,
  Res
} from 'sr2020-mm-event-engine';
import { mainServerConstants } from '../api/constants';

export type PostUserPosition = (arg: Typed<'postUserPosition', {
  characterId: number, 
  ssid: string
}>) => Promise<Response>;

export interface PostUserPositionServiceContract extends ServiceContract {
  Request: PostUserPosition;
  Action: never;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const metadata: ServiceContractTypes<PostUserPositionServiceContract> = {
  requests: [
    'postUserPosition',
  ],
  actions: [],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class PostUserPositionService extends AbstractService<PostUserPositionServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(metadata);
  }

  async getPostUserPosition(request: Req<PostUserPosition>): Res<PostUserPosition> {
    const { characterId, ssid } = request;
    return fetchWithTimeout(mainServerConstants().positionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-User-Id': String(characterId),
      },
      body: JSON.stringify({
        beacons: [{
          ssid: ssid,
          bssid: ssid,
          level: -10,
        }],
      }),
    });
  }
}

