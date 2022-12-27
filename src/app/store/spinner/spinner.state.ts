import { createFeatureSelector } from '@ngrx/store';

export interface SpinnerState {
  isOpen: boolean;
  text: string
}
export const INITIAL_STATE: SpinnerState = {
  isOpen: false,
  text: ''
};

export const selectSpinnerState = createFeatureSelector<SpinnerState>(
  'spinner'
);
