import fetch from 'isomorphic-fetch';
import { CharacterModelData } from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from './constants';


// https://models-manager.evarun.ru/character/model/51935
export async function getCharacterModelData(modelId: number): Promise<CharacterModelData> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${modelId}`);
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

interface SpiritProps {
  name: string;
  hp: number;
  abilityIds: string[];
}

export async function suitSpirit(
  characterId: number, 
  spiritProps: SpiritProps, 
  bodyStorageId: number, 
  spiritStorageId: number
): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

export async function dispirit(
  characterId: number, 
  bodyStorageId: number, 
  spiritStorageId: number | null
): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

export async function wound(
  characterId: number, 
): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

export async function clinicalDeathCombo(
  characterId: number, 
  bodyStorageId: number, 
  locationId: number | null
): Promise<unknown> {
  const res2 = await dispirit(characterId, bodyStorageId, null);
  const res3 = await wound(characterId);
  const res4 = await clinicalDeath(characterId, locationId);
  return {
    res2,
    res3,
    res4
  };
}

export async function clinicalDeath(
  characterId: number, 
  locationId: number | null
): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

export async function zeroSpiritAbilities(
  characterId: number, 
): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

// {
//   "eventType": "emergencySpiritExit", 
//   "data": {
//   }
// }

// export async function emergencySpiritExit(
//   characterId: number
// ): Promise<unknown> {
//   const res2 = await fetch(`${genericServerConstants2().characterModelUrl}/${characterId}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json;charset=utf-8',
//     },
//     body: JSON.stringify({
//       "eventType": "emergencySpiritExit", 
//       "data": {}
//     }),
//   });
//   if (res2.status === 201) {
//     return await res2.json();
//   }
//   const text = await res2.text();
//   throw new Error(`Ошибка при экстренном снятии духа персонажем ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
// }