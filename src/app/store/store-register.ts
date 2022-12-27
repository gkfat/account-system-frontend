import { spinnerReducer } from './spinner';
import { AuthEffects, authReducer } from './auth';

export const store = {
  auth: authReducer,
  spinner: spinnerReducer
};

export const effects = [
  AuthEffects
];