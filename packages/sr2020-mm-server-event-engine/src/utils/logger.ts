import { GMLogger } from "sr2020-mm-event-engine";

import { winstonLogger } from '../gameModel/winstonLogger';

const logger: GMLogger = winstonLogger;

export function createLogger (loggerName: string) {
  return winstonLogger.customChild(winstonLogger, { service: loggerName });
}

export { 
  logger as winstonLogger,
};
