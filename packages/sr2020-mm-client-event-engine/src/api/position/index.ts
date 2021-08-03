import { BeaconRecord } from "sr2020-mm-event-engine";
import { SERVER_URL, POST_USER_POSITION, joinUrl } from '../settings';

export async function postUserPosition(characterId: number, beacon: BeaconRecord): Promise<Response> {
  const url = joinUrl(SERVER_URL, POST_USER_POSITION, `/${characterId}`);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(beacon),
  });
}
