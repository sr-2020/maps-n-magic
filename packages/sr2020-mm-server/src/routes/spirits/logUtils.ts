import { ErrorResponse, GMLogger } from "sr2020-mm-event-engine";
import { mmLog } from "sr2020-mm-server-event-engine";
import shortid from 'shortid';

export enum EndpointId {
  CATCH_SPIRIT = 'CATCH_SPIRIT',
  FREE_SPIRIT = 'FREE_SPIRIT',
  SUIT_SPIRIT = 'SUIT_SPIRIT',
  DISPIRIT = 'DISPIRIT',
  EMERGENCY_DISPIRIT = 'EMERGENCY_DISPIRIT',
  POST_USER_POSITION = 'POST_USER_POSITION',
}

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
  
  success ( message: string ) {
    this.logger.info(this.endpointId + '_SUCCESS', `${this.uid} Character ${this.characterId} ${message}`);
    mmLog(this.endpointId + '_SUCCESS', `${this.uid} Character ${this.characterId} ${message}`);
  }
  
  fail ( error: ErrorResponse ) {
    this.logger.info(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
    mmLog(this.endpointId + '_FAIL', `${this.uid} Character ${this.characterId} error ${JSON.stringify(error)}`);
  }

  setCharacterId (characterId: number) {
    this.characterId = characterId;
  }
}
