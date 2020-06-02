import { CHARACTER_STATES_URL } from '../settings';

export async function getCharacterStates() {
  return fetch(`${CHARACTER_STATES_URL}/characterStates`)
    .then((result) => {
      if (!result.ok) throw new Error(result);
      return result.json();
    });
}

export async function putCharacterState(message) {
  return fetch(`${CHARACTER_STATES_URL}/characterStates`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(message),
  })
    .then((result) => {
      if (!result.ok) throw new Error(result);
      return null;
    });
}
