import { SERVER_URL, POST_USER_POSITION, joinUrl } from '../settings';

export async function postUserPosition(characterId, beacon) {
  const url = joinUrl(SERVER_URL, POST_USER_POSITION, `/${characterId}`);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(beacon),
  });
}
