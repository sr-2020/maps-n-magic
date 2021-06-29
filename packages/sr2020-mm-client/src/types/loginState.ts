export interface UnknownState {
  status: 'unknown';
}

export interface LoadingState {
  status: 'loading';
}

export interface ErrorState {
  status: 'error';
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