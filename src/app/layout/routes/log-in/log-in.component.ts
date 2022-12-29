import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { Router } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UsersService } from 'src/app/api/users.service';
import { Store } from '@ngrx/store';
import { Users } from 'src/app/core/models';
import { AuthState, selectState, LogInAction } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { map, tap, catchError, of } from 'rxjs';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService, FacebookLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogInComponent extends BaseComponent implements OnInit {
  @ViewChild('googleLoginButton', { read: ElementRef }) googleLoginButton!: ElementRef;

  private tokenKey: string = environment.cookieKeys.token;
  private auth$ = this.authStore.select(selectState);

  // 0: log in, 1: sign up
  public pageState: number = 0;

  public logInForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  public showPassword: boolean = false;
  public signUpForm: UntypedFormGroup = this.formBuilder.group({
    email: [null, [
      Validators.required,
      Validators.email
    ]],
    password: [null, [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    ]],
    passwordConfirm: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    socialSignUp: false
  });

  public validations = {
    confirmPassword: false
  }

  constructor(
    private usersServ: UsersService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private translateServ: TranslateService,
    private spinnerState: Store<SpinnerState>,
    private socialAuthServ: SocialAuthService
  ) { super(); }

  ngOnInit() {
    this.changePageState(0);
    this.authListener();
    this.signUpForm.valueChanges.pipe(
      tap(() => this.passwordValidator())
    ).subscribe();
  }

  // 變更登入／註冊
  public changePageState(state: number) {
    this.pageState = state;
    this.resetLogInForm();
    this.resetSignUpForm();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        if ( state.accessToken && state.user ) {
          this.router.navigate(['/dashboard']);
        } else {
          this.resetSignUpForm();
        }
      }),
      switchMap(() => this.socialAuthServ.initState),
      switchMap(() => this.socialAuthServ.authState),
        tap(user => {
          // Listen social login or sign up
          if ( user ) {
            const token = localStorage.getItem(this.tokenKey);
            if (!token) {
              if ( this.pageState === 0 ) { // Log in
                  console.log('Log in with', user.provider);
                  const payload = new Users.LogIn();
                  payload.email = user.email;
                  payload.socialLogin = true;
                  this.authStore.dispatch(new LogInAction(payload));
              } else { // Sign up
                  console.log('Sign up with', user.provider);
                  this.signUpForm.patchValue({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: '',
                  passwordConfirm: '',
                  socialSignUp: true
                })
                this.signUp();
              }
            }
          }
        }),
    ).subscribe();
  }

  // 重置登入表單
  public resetLogInForm() {
    this.logInForm.reset();
    this.cd.markForCheck();
  }

  // 重置註冊表單
  public resetSignUpForm() {
    this.validations.confirmPassword = false;
    this.signUpForm.reset();
    this.cd.markForCheck();
  }

  public toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  /*
  ** Validators
  */

  public getLogInFormControl(): {
    email: AbstractControl,
    password: AbstractControl
  } {
    return {
      email: this.logInForm.get('email')!,
      password: this.logInForm.get('password')!
    };
  }

  public getSignUpFormControl(): {
    email: AbstractControl,
    firstName: AbstractControl,
    lastName: AbstractControl,
    password: AbstractControl,
    passwordConfirm: AbstractControl,
    socialSignUp: AbstractControl
  } {
    return {
      email: this.signUpForm.get('email')!,
      firstName: this.signUpForm.get('firstName')!,
      lastName: this.signUpForm.get('lastName')!,
      password: this.signUpForm.get('password')!,
      passwordConfirm: this.signUpForm.get('passwordConfirm')!,
      socialSignUp: this.signUpForm.get('socialSignUp')!
    };
  }

  // 驗證密碼組合是否相同
  public checkSamePassword(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  // 驗證輸入密碼
  public passwordValidator() {
    const formControl = this.getSignUpFormControl(),
          password = formControl.password.value,
          passwordConfirm = formControl.passwordConfirm.value;
    this.validations.confirmPassword = this.checkSamePassword(password, passwordConfirm);
  }

  // 登入
  public logIn() {
    const formControl = this.getLogInFormControl(),
          payload = new Users.LogIn({
            email: formControl.email.value,
            password: formControl.password.value,
            socialLogin: false
          });
    this.authStore.dispatch(new LogInAction(payload));
    this.cd.markForCheck();
  }

  // 註冊
  public signUp() {
    const formControl = this.getSignUpFormControl(),
          payload = new Users.CreateUser({
            email: formControl.email.value,
            firstName: formControl.firstName.value,
            lastName: formControl.lastName.value,
            password: formControl.password.value,
            passwordConfirm: formControl.passwordConfirm.value,
            socialSignUp: formControl.socialSignUp.value
          });
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.CreateUser(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(() => {
        this.spinnerState.dispatch(new CloseAction());
        alert(this.translateServ.instant('ALERT.SIGN_UP_SUCCESS'));
        this.changePageState(0);
      })
    ).subscribe();
  }

  /*
  ** Social log in
  */
  public logInFacebook() {
    this.socialAuthServ.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
