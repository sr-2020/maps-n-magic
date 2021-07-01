import { ErrorResponse } from "sr2020-mm-event-engine";

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