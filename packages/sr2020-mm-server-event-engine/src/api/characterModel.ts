import fetch from 'isomorphic-fetch';
import { CharacterModelData } from 'sr2020-mm-event-engine';
import { genericServerConstants2 } from './constants';

// https://models-manager.evarun.ru/character/model/51935
export async function getCharacterModelData(modelId: number): Promise<CharacterModelData> {
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

