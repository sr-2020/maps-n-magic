import { ErrorResponse, TokenData } from "sr2020-mm-event-engine";

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

export interface LinkDef {
  to: string;
  label: string;
}