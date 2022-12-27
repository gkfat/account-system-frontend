import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class BaseComponent implements OnDestroy {
  constructor(
  ) { }

  protected unsubscribe$ = new Subject<void>();

  public trackByFn(idx: number) {
    return idx;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
