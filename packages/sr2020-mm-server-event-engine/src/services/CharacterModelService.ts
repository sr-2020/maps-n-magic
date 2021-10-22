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
  CharacterModelData,
} from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from '../api/constants';

interface SpiritProps {
  name: string;
  hp: number;
  abilityIds: string[];
}

export type GetCharacterModelData = (arg: Typed<'characterModelData', {
  modelId: number, 
}>) => Promise<CharacterModelData>;

export type SuitSpirit = (arg: Typed<'suitSpirit', {
  characterId: number, 
  spiritProps: SpiritProps, 
  bodyStorageId: number, 
  spiritStorageId: number
}>) => Promise<unknown>;

export type Dispirit = (arg: Typed<'dispirit', {
  characterId: number, 
  bodyStorageId: number, 
  spiritStorageId: number | null
}>) => Promise<unknown>;

export type ClinicalDeathCombo = (arg: Typed<'clinicalDeathCombo', {
  characterId: number, 
  bodyStorageId: number, 
  locationId: number | null
}>) => Promise<unknown>;

export type ZeroSpiritAbilities = (arg: Typed<'zeroSpiritAbilities', {
  characterId: number, 
}>) => Promise<unknown>;

export interface CharacterModelServiceContract extends ServiceContract {
  Request: GetCharacterModelData;
  Action: 
    | SuitSpirit
    | Dispirit
    | ClinicalDeathCombo
    | ZeroSpiritAbilities
  ;
  EmitEvent: never;
  ListenEvent: never;
  NeedAction: never;
  NeedRequest: never;
}

const pupMetadata: ServiceContractTypes<CharacterModelServiceContract> = {
  requests: [
    'characterModelData'
  ],
  actions: [
    'clinicalDeathCombo',
    'dispirit',
    'suitSpirit',
    'zeroSpiritAbilities',
  ],
  emitEvents: [],
  listenEvents: [],
  needActions: [],
  needRequests: []
};

export class CharacterModelService extends AbstractService<CharacterModelServiceContract> {
  constructor(gameModel: GameModel, logger: GMLogger) {
    super(gameModel, logger);
    this.setMetadata(pupMetadata);
  }

  // https://models-manager.evarun.ru/character/model/51935
  async getCharacterModelData({ modelId }: Req<GetCharacterModelData>): Res<GetCharacterModelData> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${modelId}`, {
      headers: {
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      }
    });
    if (res2.status === 200) {
      const characterModelData = await res2.json();
      return characterModelData;
    }
    const text = await res2.text();
    throw new Error(`Error on getting character model data. Character modelId ${modelId}, status ${res2.status}, error text ${text}`);
  }

  // {
//   "eventType": "suitSpirit", 
//   "data": {
    // "name": "Petya"; // имя духа
    // "hp": 5; // хиты духа
    // "abilityIds": ["some-spirit-ability"]; // список абилок духа
//     bodyStorageId: "616"; // QR телохранилища
//     qrCodeId: "931"; // QR духохранилища
//   }
// }

  async suitSpirit({
    characterId, 
    spiritProps, 
    bodyStorageId, 
    spiritStorageId
  }: Req<SuitSpirit>): Res<SuitSpirit> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "suitSpirit", 
        "data": {
          ...spiritProps,
          bodyStorageId: String(bodyStorageId),
          qrCodeId: String(spiritStorageId)
        }
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при надевании духа персонажем ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
  }

  // {
  //   "eventType": "dispirit", 
  //   "data": {
  //     bodyStorageId: "616"; // QR телохранилища
  //     qrCodeId: "931"; // QR духохранилища, может отсутствовать
  //   }
  // }

  async dispirit({
    characterId, 
    bodyStorageId, 
    spiritStorageId
  }: Req<Dispirit>): Res<Dispirit> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "dispirit", 
        "data": {
          bodyStorageId: String(bodyStorageId),
          qrCodeId: spiritStorageId !== null ? String(spiritStorageId) : undefined
        }
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при снятии духа персонажем ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
  }

  async wound(
    characterId: number, 
  ): Promise<unknown> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "wound"
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при тяжране персонажа ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
  }

  async clinicalDeathCombo({
    characterId, 
    bodyStorageId, 
    locationId
  }: Req<ClinicalDeathCombo>): Res<ClinicalDeathCombo> {
    const res2 = await this.dispirit({
      type: 'dispirit',
      characterId, 
      bodyStorageId, 
      spiritStorageId: null
    });
    const res3 = await this.wound(characterId);
    const res4 = await this.clinicalDeath(characterId, locationId);
    return {
      res2,
      res3,
      res4
    };
  }

  async clinicalDeath(
    characterId: number, 
    locationId: number | null
  ): Promise<unknown> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "clinicalDeath",
        "data": {
          "location": { 
            "id": locationId
          }
        }
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при тяжране персонажа ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
  }

  async zeroSpiritAbilities({
    characterId, 
  }: Req<ZeroSpiritAbilities>): Res<ZeroSpiritAbilities> {
    const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${genericServerConstants2().modelsManagerToken}`,
      },
      body: JSON.stringify({
        "eventType": "zeroSpiritAbilities", 
        data: {}
      }),
    });
    if (res2.status === 201) {
      return await res2.json();
    }
    const text = await res2.text();
    throw new Error(`Ошибка при аварийном снятии абилок духа с персонажа ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
  }
}
