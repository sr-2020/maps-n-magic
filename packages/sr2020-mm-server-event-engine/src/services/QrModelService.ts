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
} from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from '../api/constants';

export type GetQrModelData = (arg: Typed<'qrModelData', {
  qrId: number, 
}>) => Promise<unknown>;

export type FreeSpiritFromStorage = (arg: Typed<'freeSpiritFromStorage', {
  spiritStorageId: number, 
  reason?: string
}>) => Promise<void>;

export type PutSpiritInStorage = (arg: Typed<'putSpiritInStorage', {
  spiritStorageId: number, 
  spiritId: number
}>) => Promise<void>;

export interface QrModelServiceContract extends ServiceContract {
  Request: GetQrModelData;
  Action: 
    | FreeSpiritFromStorage
    | PutSpiritInStorage
  ;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const pupMetadata: ServiceContractTypes<QrModelServiceContract> = {
  requests: [
    'qrModelData'
  ],
  actions: [
    'freeSpiritFromStorage',
    'putSpiritInStorage'
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class QrModelService extends AbstractService<QrModelServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  async getQrModelData({ qrId }: Req<GetQrModelData>): Res<GetQrModelData> {
    // this.logger.info('getQrModelData', qrId);
    const res2 = await fetch(`${genericServerConstants2().qrModelUrl}/${qrId}`, {
      headers: {
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
    });
    if (res2.status === 200) {
      const characterModelData = await res2.json();
      return characterModelData;
    }
    if (res2.status === 404) {
      throw new Error(`QR ${qrId} не найден`);
    }
    const text = await res2.text();
    throw new Error(`Ошибка при получении данных из QR. QR id ${qrId}, статус ${res2.status}, текст ошибки ${text}`);
  }
  
  async freeSpiritFromStorage({
    spiritStorageId, 
    reason
  }: Req<FreeSpiritFromStorage>): Res<FreeSpiritFromStorage> {
    this.logger.info('freeSpiritFromStorage', spiritStorageId);
    // await suitSpirit(51935, {
    //   "name": "Petya",
    //   "hp": 5,
    //   "abilityIds": ["fireball"],
    // }, 360, spiritStorageId);
    // return;
  
    const res2 = await fetch(`${genericServerConstants2().qrModelUrl}/${spiritStorageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "freeSpirit", 
        "data": {
          reason
        }
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при освобождении духа из QR ${spiritStorageId}, статус ${res2.status}, текст ошибки ${text}`);
  }
  
  async putSpiritInStorage({
    spiritStorageId, 
    spiritId
  }: Req<PutSpiritInStorage>): Res<PutSpiritInStorage> {
    this.logger.info('putSpiritInStorage', spiritStorageId);
    // await dispirit(51935, 360, spiritStorageId);
    // return;
  
    const res2 = await fetch(`${genericServerConstants2().qrModelUrl}/${spiritStorageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "putSpiritInJar", 
        "data": {
          "spiritId": spiritId
        }
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при ловле духа в QR ${spiritStorageId}, статус ${res2.status}, текст ошибки ${text}`);
  }
}
