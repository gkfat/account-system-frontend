import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSpinnerState, SpinnerState } from 'src/app/store/spinner';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {
  private spinnerStore$ = this.spinnerStore.select(selectSpinnerState);
  private unsubscribe$ = new Subject<void>();
  public spinnerState: SpinnerState = {
    isOpen: false,
    text: ''
  };

  constructor(
    private spinnerStore: Store<SpinnerState>,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.spinnerStore$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((spinner) => {
      this.spinnerState = spinner;
      this.cd.markForCheck();
    });
  }


}
