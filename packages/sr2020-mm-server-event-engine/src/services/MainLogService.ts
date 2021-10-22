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
  MainHistoryItem
} from 'sr2020-mm-event-engine';
import { pool } from '../api/pgPool';

export type GetMainLog = (arg: Typed<'mainLog', {
  characterId: number, 
}>) => Promise<MainHistoryItem[]>;

export type PutMainLogRecord = (arg: Typed<'putMainLogRecord', {
  recordType: string,
  message: string
}>) => Promise<void>;

export interface MainLogServiceContract extends ServiceContract {
  Request: GetMainLog;
  Action: PutMainLogRecord;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const pupMetadata: ServiceContractTypes<MainLogServiceContract> = {
  requests: [
    'mainLog'
  ],
  actions: [
    'putMainLogRecord',
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class MainLogService extends AbstractService<MainLogServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getMainLog({ characterId }: Req<GetMainLog>): Res<GetMainLog> {
    // this.logger.info('getMainLog');
    const { rows } = await pool.query('SELECT * FROM "mmLog" WHERE message like \'%' + characterId + '%\' ORDER BY timestamp DESC');
    return rows;
  }

  async putMainLogRecord({
    recordType,
    message,
  }: Req<PutMainLogRecord>): Res<PutMainLogRecord> {
    // this.logger.info('putMainLogRecord');
    try{
      await pool.query('INSERT INTO "mmLog"(timestamp, type, message) VALUES($1,$2,$3)', [new Date(), recordType, message]);
    } catch(err) {
      this.logger.info(`Error on posting message ${recordType} ${message}`, err);
    }
  }
}
