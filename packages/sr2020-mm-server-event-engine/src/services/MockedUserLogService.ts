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
  Res,
  UserHistoryItem
} from 'sr2020-mm-event-engine';
import { userHistoryItems } from '../mockedData/userHistoryItems';
import { GetUserLog, UserLogServiceContract, PutUserLogRecord } from './UserLogService';

const pupMetadata: ServiceContractTypes<UserLogServiceContract> = {
  requests: [
    'userLog'
  ],
  actions: [
    'putUserLogRecord',
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class MockedUserLogService extends AbstractService<UserLogServiceContract> {
  historyItems: UserHistoryItem[] = userHistoryItems;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getUserLog({ characterId }: Req<GetUserLog>): Res<GetUserLog> {
    // this.logger.info('getUserLog');
    return this.historyItems.filter(el => el.characterId === characterId);
  }

  async putUserLogRecord({
    characterId,
    title,
    text
  }: Req<PutUserLogRecord>): Res<PutUserLogRecord> {
    // this.logger.info('putUserLogRecord');
    this.historyItems.push({
      timestamp: new Date().toString(),
      characterId,
      data: {
        title,
        text
      }
    });
  }
}
