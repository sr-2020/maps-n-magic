import { GMLogger } from "sr2020-mm-event-engine";

export { makeGameModel } from './gameModel';
import { winstonLogger } from './gameModel/winstonLogger';
export { innerPostUserPosition } from './api/position';

const logger: GMLogger = winstonLogger;

export { logger as winstonLogger };

export * from './services/CharacterLocationService/index';
export * from './services/CharacterLocationService/types';
export * from './services/PushNotificationService';