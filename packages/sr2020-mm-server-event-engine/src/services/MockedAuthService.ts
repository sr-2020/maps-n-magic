import * as R from 'ramda';
import * as jwt from "jsonwebtoken";

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
import { genericServerConstants2 } from '../api/constants';
import { GetUserToken } from './AuthService';

export interface MockedAuthServiceContract extends ServiceContract {
  Request: GetUserToken;
  Action: never;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const pupMetadata: ServiceContractTypes<MockedAuthServiceContract> = {
  requests: [
    'userToken',
  ],
  actions: [],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class MockedAuthService extends AbstractService<MockedAuthServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getUserToken(request: Req<GetUserToken>): Res<GetUserToken> {
    const parsedToken = {
      "sub": "51935",
      "auth": "ROLE_MASTER,ROLE_PLAYER",
      "modelId": 51935,
      "characterId": 736,
      "exp": 1677974839
    };

    const api_key = jwt.sign(parsedToken, genericServerConstants2().JWT_SECRET);
    return {
      status: 200,
      json: () => Promise.resolve({
        api_key,
        "id": parsedToken.modelId
      })
    } as Response;
  }
}

