import { Action } from '@ngrx/store';
import * as spinner from './spinner.action';
import { INITIAL_STATE, SpinnerState } from './spinner.state';
export function spinnerReducer(state: SpinnerState = INITIAL_STATE, action: Action): SpinnerState {
  switch (action.type) {
    case spinner.OPEN:
      return {
        ...state,
        isOpen: true,
        text: (<spinner.OpenAction>action).text
      };
    case spinner.CLOSE:
      return {
        ...state,
        isOpen: false
      };
    default:
      return state;
  }
}
