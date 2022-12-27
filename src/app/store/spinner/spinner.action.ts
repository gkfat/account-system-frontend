import { Action } from '@ngrx/store';


export const OPEN = '[spinner] open';
export const CLOSE = '[spinner] close';


export class OpenAction implements Action {
  readonly type: string = OPEN;
  constructor(public text: string) { }
}

export class CloseAction implements Action {
  readonly type: string = CLOSE;
  constructor() { }
}
