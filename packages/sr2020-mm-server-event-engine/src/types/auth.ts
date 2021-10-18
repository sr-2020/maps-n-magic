import type { Request } from 'express';
import { CharacterModelData, GameModel, TokenData, WeakTokenData } from "sr2020-mm-event-engine";
import { CharacterWatcher } from "../characterWatcher";

export type PlayerAuthorizedRequest = Request & {
  userData: TokenData;
  gameModel: GameModel;
  characterModelData: CharacterModelData;
  characterWatcher: CharacterWatcher;
}

export type InnerApiRequest = Request & {
  gameModel: GameModel;
  userData: TokenData;
};

export type MainAuthorizedRequest = Request & {
  gameModel: GameModel;
  userData: WeakTokenData;
}
