import { ErrorResponse, TokenData, CharacterModelData } from "sr2020-mm-event-engine";

export interface UnknownState {
  status: 'unknown';
}

export interface LoadingState {
  status: 'loading';
}

export interface ErrorState {
  status: 'error';
  errorResponse: ErrorResponse;
}

export interface UserLoggedState {
  status: 'userLogged';
  tokenData: TokenData;
  characterModelData: CharacterModelData;
}

export interface UserUnloggedState {
  status: 'userUnlogged';
}

export type LoginState =
  | UnknownState
  | UserLoggedState
  | UserUnloggedState
  | ErrorState
  | LoadingState
;