import { innerPostUserPosition } from '../../api/position';

export async function postUserPosition(characterId, beacon) {
  return innerPostUserPosition(characterId, beacon);
}
