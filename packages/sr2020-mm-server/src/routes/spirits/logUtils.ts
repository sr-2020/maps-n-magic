import { ErrorResponse, GMLogger } from "sr2020-mm-event-engine";
import { createLogger, mmLog, mmUserLog } from "sr2020-mm-server-event-engine";
import shortid from 'shortid';

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

export class EndpointLogger {
  characterId: number | null = null;
  uid: string;

  constructor(
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
      mmUserLog(this.characterId, endpointDisplayName[this.endpointId], userMessage);
    } else {
      logger.info(`${this.uid} Character id is not specified for ${this.endpointId} SUCCESS`);
    }
  }
  
  fail ( error: ErrorResponse, userMessage: string = '' ) {
    this.logger.info(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
    mmLog(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
    if (this.characterId !== null) {
      mmUserLog(this.characterId, endpointDisplayName[this.endpointId] + ' - неудача', userMessage);
    } else {
      logger.info(`${this.uid} Character id is not specified for ${this.endpointId} FAIL`);
    }
  }

  setCharacterId (characterId: number) {
    this.characterId = characterId;
  }
}
