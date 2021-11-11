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
import { mainHistoryItems } from '../mockedData/mainHistoryItems';
import { GetMainLog, MainLogServiceContract, PutMainLogRecord } from './MainLogService';

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

export class MockedMainLogService extends AbstractService<MainLogServiceContract> {
  historyItems: MainHistoryItem[] = mainHistoryItems;

  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getMainLog({ characterId }: Req<GetMainLog>): Res<GetMainLog> {
    // this.logger.info('getMainLog');
    return this.historyItems.filter(el => el.message.includes(String(characterId)));
  }

  async putMainLogRecord({
    recordType,
    message,
  }: Req<PutMainLogRecord>): Res<PutMainLogRecord> {
    // this.logger.info('putMainLogRecord');
    this.historyItems.push({
      timestamp: new Date().toString(),
      type: recordType,
      message
    });
  }
}
