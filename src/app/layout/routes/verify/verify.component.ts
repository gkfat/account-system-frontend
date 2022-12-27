import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from 'src/app/api/users.service';
import { Store } from '@ngrx/store';
import { Users } from 'src/app/core/models';
import { AuthState } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { map, tap, catchError, of } from 'rxjs';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { UntypedFormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EnumVerifyState } from 'src/app/core/enums';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyComponent extends BaseComponent implements OnInit {
  public verifyState: number = EnumVerifyState.ResendVerify;

  public resendVerifyForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, [
      Validators.required,
      Validators.email
    ]]
  });

  constructor(
    private usersServ: UsersService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private spinnerState: Store<SpinnerState>
  ) { super(); }

  ngOnInit() {
    this.verifyState = EnumVerifyState.ResendVerify;
    this.activatedRoute.queryParams.pipe(
      tap(params => {
        if ( params['id'] && params['verificationCode'] ) {
          this.verifyEmail(params);
        }
        this.resetResendVerifyForm();
      })
    ).subscribe();
  }

  // 重置重發驗證信表單
  public resetResendVerifyForm() {
    this.resendVerifyForm.reset();
    this.cd.markForCheck();
  }

  /*
  ** Validators
  */

  public getFormControl(): {
    email: AbstractControl
  } {
    return {
      email: this.resendVerifyForm.get('email')!
    };
  }

  // 重發驗證信
  public resendVerify() {
    const payload = new Users.ResendVerify({
      email: this.getFormControl().email.value
    })
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.resendVerify(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data.verifyState),
      tap((verifyState) => {
        this.spinnerState.dispatch(new CloseAction());
        this.changeVerifySate(verifyState);
      })
    ).subscribe();

  }

  // 驗證 email
  public verifyEmail(params: Params) {
    console.log(params);
    const payload = new Users.Verify({
      id: params['id'],
      verificationCode: params['verificationCode']
    });
    this.spinnerState.dispatch(new OpenAction('Verifying...'));
    this.usersServ.verify(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data.verifyState),
      tap((verifyState) => {
        this.spinnerState.dispatch(new CloseAction());
        this.changeVerifySate(verifyState);
      })
    ).subscribe();
  }

  public changeVerifySate(state: number) {
    this.verifyState = state;
    this.cd.markForCheck();
  }

}
