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
  const res2 = await fetch('https://models-manager.evarun.ru/character/model/' + characterId);
  if (res2.status === 200) {
    const characterModelData = await res2.json();
    return characterModelData;
  }
  const text = await res2.text();
  throw new Error(`Error on getting character model data. CharacterId ${characterId}, status ${res2.status}, error text ${text}`);
}
