import { ErrorResponse, GameModel, GMLogger } from "sr2020-mm-event-engine";
import shortid from 'shortid';
import { createLogger } from "./logger";
import { mmLog } from "../api/spirits/mmLog";
import { PutUserLogRecord } from "../services/UserLogService";

const logger = createLogger('logUtils.ts');

export enum EndpointId {
  CATCH_SPIRIT = 'CATCH_SPIRIT',
  FREE_SPIRIT = 'FREE_SPIRIT',
  SUIT_SPIRIT = 'SUIT_SPIRIT',
  DISPIRIT = 'DISPIRIT',
  EMERGENCY_DISPIRIT = 'EMERGENCY_DISPIRIT',
  POST_USER_POSITION = 'POST_USER_POSITION',
}

const endpointDisplayName: Record<EndpointId, string> = {
  [EndpointId.CATCH_SPIRIT]: 'Ловля духа',
  [EndpointId.FREE_SPIRIT]: 'Освобождение духа',
  [EndpointId.SUIT_SPIRIT]: 'Надевание духа',
  [EndpointId.DISPIRIT]: 'Снятие духа',
  [EndpointId.EMERGENCY_DISPIRIT]: 'Тело духа уничтожено',
  [EndpointId.POST_USER_POSITION]: 'Переход в локацию',
};

export function logCharacterAction(
  gameModel: GameModel,
  logger: GMLogger,
  uid: string,
  type: string,
  characterId: number,
  message: string,
  userTitle: string,
  userMessage: string = '',
  userOnly: boolean = false
) {
  if (!userOnly) {
    logger.info(type, `${uid} Character ${characterId} ${message}`);
    mmLog(type, `${uid} Character ${characterId} ${message}`);
  }
  gameModel.execute2<PutUserLogRecord>({
    type: 'putUserLogRecord',
    characterId,
    title: userTitle,
    text: userMessage
  });
}

export class EndpointLogger {
  characterId: number | null = null;
  uid: string;

  constructor(
    private gameModel: GameModel,
    private logger: GMLogger,
    private endpointId: EndpointId,
  ) {
    this.uid = shortid.generate();
  }
  
  attempt ( body: unknown ) {
    this.logger.info(this.endpointId + '_ATTEMPT', `${this.uid} data ${JSON.stringify(body)}`);
    mmLog(this.endpointId + '_ATTEMPT', `${this.uid} data ${JSON.stringify(body)}`);
  }
  
  success ( message: string, userMessage: string = '' ) {
    this.logger.info(this.endpointId + '_SUCCESS', `${this.uid} Character ${this.characterId} ${message}`);
    mmLog(this.endpointId + '_SUCCESS', `${this.uid} Character ${this.characterId} ${message}`);
    if (this.characterId !== null) {
      this.gameModel.execute2<PutUserLogRecord>({
        type: 'putUserLogRecord',
        characterId: this.characterId,
        title: endpointDisplayName[this.endpointId],
        text: userMessage
      });
    } else {
      logger.info(`${this.uid} Character id is not specified for ${this.endpointId} SUCCESS`);
    }
  }
  
  fail ( error: ErrorResponse, userMessage: string = '' ) {
    this.logger.info(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
    mmLog(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
    if (this.characterId !== null) {
      this.gameModel.execute2<PutUserLogRecord>({
        type: 'putUserLogRecord',
        characterId: this.characterId,
        title: endpointDisplayName[this.endpointId] + ' - неудача',
        text: userMessage
      });
    } else {
      logger.info(`${this.uid} Character id is not specified for ${this.endpointId} FAIL`);
    }
  }

  setCharacterId (characterId: number) {
    this.characterId = characterId;
  }
}
