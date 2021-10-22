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
import { pool } from '../api/pgPool';

export type GetUserLog = (arg: Typed<'userLog', {
  characterId: number, 
}>) => Promise<UserHistoryItem[]>;

export type PutUserLogRecord = (arg: Typed<'putUserLogRecord', {
  characterId: number,
  title: string,
  text: string
}>) => Promise<void>;

export interface UserLogServiceContract extends ServiceContract {
  Request: GetUserLog;
  Action: PutUserLogRecord;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

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

export class UserLogService extends AbstractService<UserLogServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getUserLog({ characterId }: Req<GetUserLog>): Res<GetUserLog> {
    // this.logger.info('getUserLog');
    const { rows } = await pool.query('SELECT timestamp, "characterId", data FROM "mmUserLog" WHERE "characterId" = $1 ORDER BY timestamp DESC LIMIT 100', [characterId]);
    return rows;
  }

  async putUserLogRecord({
    characterId,
    title,
    text
  }: Req<PutUserLogRecord>): Res<PutUserLogRecord> {
    // this.logger.info('putUserLogRecord');
    try{
      await pool.query('INSERT INTO "mmUserLog"(timestamp, "characterId", data) VALUES($1,$2,$3)', [new Date(), characterId, {
        title,
        text
      }]);
    } catch(err) {
      this.logger.info(`Error on posting user message ${characterId} ${title} ${text}`, err);
    }
  }
}

