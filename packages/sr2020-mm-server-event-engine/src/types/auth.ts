import type { Request } from 'express';
import { CharacterModelData, GameModel, TokenData, WeakTokenData } from "sr2020-mm-event-engine";

export type InnerApiRequest = Request & {
  gameModel: GameModel;
  userData: TokenData;
};

export type MainAuthorizedRequest = Request & {
  gameModel: GameModel;
  userData: WeakTokenData;
}
