import fetch from 'isomorphic-fetch';
import { GATEWAY_URL, MODELS_MANAGER_URL } from "../constants";

export async function getUserTokenData(login: string, password: string) {
  return await fetch(GATEWAY_URL + '/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      login,
      password,
      "rememberMe": false
    })
  });
}

export async function getCharacterModelData(characterId: string): Promise<unknown> {
  const res2 = await fetch(MODELS_MANAGER_URL + '/character/model/' + characterId);
  if (res2.status === 200) {
    const characterModelData = await res2.json();
    return characterModelData;
  }
  const text = await res2.text();
  throw new Error(`Error on getting character model data. CharacterId ${characterId}, status ${res2.status}, error text ${text}`);
}

export async function getQrModelData(qrId: number): Promise<unknown> {
  const res2 = await fetch(MODELS_MANAGER_URL + '/qr/model/' + qrId);
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

export async function freeSpirit(spiritStorageId: number, reason: string): Promise<unknown> {
  // await suitSpirit(51935, {
  //   "name": "Petya",
  //   "hp": 5,
  //   "abilityIds": ["fireball"],
  // }, 360, spiritStorageId);
  // return;

  const res2 = await fetch(MODELS_MANAGER_URL + '/qr/model/' + spiritStorageId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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

export async function catchSpirit(spiritStorageId: number, spiritId: number): Promise<unknown> {
  // await dispirit(51935, 360, spiritStorageId);
  // return;

  const res2 = await fetch(MODELS_MANAGER_URL + '/qr/model/' + spiritStorageId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
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
  const res2 = await fetch(MODELS_MANAGER_URL + '/character/model/' + characterId, {
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
  const res2 = await fetch(MODELS_MANAGER_URL + '/character/model/' + characterId, {
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
  const res2 = await fetch(MODELS_MANAGER_URL + '/character/model/' + characterId, {
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