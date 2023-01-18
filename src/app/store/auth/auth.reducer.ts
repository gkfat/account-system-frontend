

import { Action } from '@ngrx/store';
import * as auth from './auth.action';
import { AuthState, INITIAL_AUTH_STATE } from './auth.state';

export function authReducer(state: AuthState = INITIAL_AUTH_STATE, action: Action): AuthState {
  switch (action.type) {
    case auth.LOG_IN_SUCCESS:
      const { user, accessToken } = action as auth.LogInSuccessAction;
      return {
        user: user,
        accessToken: accessToken
      };
    case auth.LOG_OUT:
      console.log('Logout success');
      return {
        accessToken: null,
        user: null
      }
    case auth.TOKEN_LOG_IN:
    case auth.LOG_IN:
    default:
      return state;
  }
}
