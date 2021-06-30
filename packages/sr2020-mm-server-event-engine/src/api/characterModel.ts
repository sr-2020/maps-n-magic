import fetch from 'isomorphic-fetch';
import { mainServerConstants } from './constants';

export async function getCharacterModelData(characterId: string): Promise<unknown> {
  const res2 = await fetch(`${mainServerConstants().characterModelUrl}/${characterId}`);
  if (res2.status === 200) {
    const characterModelData = await res2.json();
    return characterModelData;
  }
  const text = await res2.text();
  throw new Error(`Error on getting character model data. CharacterId ${characterId}, status ${res2.status}, error text ${text}`);
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
  const res2 = await fetch(`${mainServerConstants().characterModelUrl}/${characterId}`, {
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
  spiritStorageId: number
): Promise<unknown> {
  const res2 = await fetch(`${mainServerConstants().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      "eventType": "dispirit", 
      "data": {
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
//   "eventType": "emergencySpiritExit", 
//   "data": {
//   }
// }

export async function emergencySpiritExit(
  characterId: number
): Promise<unknown> {
  const res2 = await fetch(`${mainServerConstants().characterModelUrl}/${characterId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      "eventType": "emergencySpiritExit", 
      "data": {}
    }),
  });
  if (res2.status === 201) {
    return await res2.json();
  }
  const text = await res2.text();
  throw new Error(`Ошибка при экстренном снятии духа персонажем ${characterId}, статус ${res2.status}, текст ошибки ${text}`);
}