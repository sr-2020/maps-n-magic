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
import { genericServerConstants2 } from '../api/constants';

export type GetUserToken = (arg: Typed<'userToken', {
  login: string, 
  password: string
}>) => Promise<Response>;

export interface AuthServiceContract extends ServiceContract {
  Request: GetUserToken;
  Action: never;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const pupMetadata: ServiceContractTypes<AuthServiceContract> = {
  requests: [
    'userToken',
  ],
  actions: [],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class AuthService extends AbstractService<AuthServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getUserToken(request: Req<GetUserToken>): Res<GetUserToken> {
    const { login, password } = request;
    return await fetch(genericServerConstants2().loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        login,
        password,
        "rememberMe": false
      })
    });
  }
}

