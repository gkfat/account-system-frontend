import { AuthState } from 'src/app/store/auth';
import { Action } from '@ngrx/store';
import { Users } from 'src/app/core/models';

export const LOG_IN = '[auth] log in';
export const LOG_IN_SUCCESS = '[auth] log in success';
export const LOG_OUT = '[auth] log out';
export const LOG_OUT_SUCCESS = '[auth] log out success';
export const TOKEN_LOG_IN = '[auth] token log in';


export class LogInAction implements Action {
  readonly type: string = LOG_IN;
  constructor(
    public payload: Users.LogIn
    ) {
      this.payload = payload;
    }
}

export class LogInSuccessAction implements Action {
  readonly type: string = LOG_IN_SUCCESS;
  public user: Users.User | null = null;
  public accessToken: string | null = null;
  constructor(
    public authState: AuthState
    ) {
      this.user = authState.user;
      this.accessToken = authState.accessToken;
    }
}

export class LogOutAction implements Action {
  readonly type: string = LOG_OUT;
  constructor() { }
}

export class TokenLogInAction implements Action {
  readonly type: string = TOKEN_LOG_IN;
  constructor() { }
}

export class LogOutSuccessAction implements Action {
  readonly type: string = LOG_OUT_SUCCESS;
  constructor() { }
}