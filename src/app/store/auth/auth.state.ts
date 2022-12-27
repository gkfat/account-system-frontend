import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Users } from 'src/app/core/models';

export interface AuthState {
  user: Users.User | null;
  accessToken: string | null;
  // payload: Users.User;
}

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  accessToken: null,
  // payload: new Users.User()
};

export const selectAuthState = createFeatureSelector<AuthState>(
  'auth'
);

export const selectState = createSelector(
  selectAuthState,
  (state: AuthState) => (state)
);
