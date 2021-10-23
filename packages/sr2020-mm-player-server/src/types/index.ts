import type { Request } from 'express';
import { CharacterModelData, GameModel, TokenData } from "sr2020-mm-event-engine";
import { CharacterWatcher } from "../gameModel/characterWatcher";

export type PlayerAuthorizedRequest = Request & {
  userData: TokenData;
  gameModel: GameModel;
  characterModelData: CharacterModelData;
  characterWatcher: CharacterWatcher;
}