import fetch from 'isomorphic-fetch';
import { genericServerConstants } from './constants';

export async function getQrModelData(qrId: number): Promise<unknown> {
  const res2 = await fetch(`${genericServerConstants().qrModelUrl}/${qrId}`);
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

  const res2 = await fetch(`${genericServerConstants().qrModelUrl}/${spiritStorageId}`, {
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

  const res2 = await fetch(`${genericServerConstants().qrModelUrl}/${spiritStorageId}`, {
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