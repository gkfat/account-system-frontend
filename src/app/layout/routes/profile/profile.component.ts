import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/components/base.component';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Users } from 'src/app/core/models';
import { UsersService } from 'src/app/api/users.service';
import { Router } from '@angular/router';
import { AuthState, LogOutAction, TokenLogInAction, selectState } from 'src/app/store/auth';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { environment } from 'src/environments/environment';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent extends BaseComponent implements OnInit {
  @ViewChild('selectFileInput', { read: ElementRef }) selectFileInput!: ElementRef;

  private tokenKey: string = environment.cookieKeys.token;

  public avatarImg: string = '';
  public onHovering: boolean = false;

  private auth$ = this.authStore.select(selectState);
  public user: Users.User = new Users.User();
  // Update profile form
  public updateProfileForm: UntypedFormGroup = this.formBuilder.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  // Change password form
  public changePasswordForm: UntypedFormGroup = this.formBuilder.group(
    {
      id: 0,
      email: '',
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ]],
      newPasswordConfirm: ['', Validators.required]
    });
  
  public validations = {
    usablePassword: false,
    confirmPassword: false
  }
  
  constructor(
    private usersServ: UsersService,
    private cd: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authStore: Store<AuthState>,
    private errServ: ErrorHandlerService,
    private spinnerState: Store<SpinnerState>,
    private translateServ: TranslateService,
    public sanitizer: DomSanitizer
  ) { super(); }

  ngOnInit() {
    this.authListener();
    this.changePasswordForm.valueChanges.pipe(
      tap(() => this.passwordValidator())
    ).subscribe();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      map(state => state.user),
      tap((state: Users.User | null) => {
        if ( state ) {
          this.user = state;
          console.log('user:', this.user)
          this.resetUpdateProfileForm();
          this.resetChangePasswordForm();
        }
      })
    ).subscribe();
  }

  // 重置變更個人資訊表單
  public resetUpdateProfileForm() {
    this.updateProfileForm.reset();
    this.updateProfileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
    this.cd.markForCheck();
  }

  // 重置變更密碼表單
  public resetChangePasswordForm() {
    this.validations.usablePassword = false;
    this.validations.confirmPassword = false;
    this.changePasswordForm.reset();
    this.changePasswordForm.patchValue({
      id: this.user.id,
      email: this.user.email
    });
    this.cd.markForCheck();
  }

  /*
  ** Validators
  */
  public getUpdateProfileFormControl(): {
    firstName: AbstractControl,
    lastName: AbstractControl
  } {
    return {
      firstName: this.updateProfileForm.get('firstName')!,
      lastName: this.updateProfileForm.get('lastName')!
    };
  }

  public getChangePasswordFormControl(): {
    oldPassword: AbstractControl,
    newPassword: AbstractControl,
    newPasswordConfirm: AbstractControl
  } {
    return {
      oldPassword: this.changePasswordForm.get('oldPassword')!,
      newPassword: this.changePasswordForm.get('newPassword')!,
      newPasswordConfirm: this.changePasswordForm.get('newPasswordConfirm')!
    };
  }

  // 驗證密碼組合是否相同
  public checkSamePassword(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  // 驗證輸入密碼
  public passwordValidator() {
    const formControl = this.getChangePasswordFormControl(),
          oldPassword = formControl.oldPassword.value,
          newPassword = formControl.newPassword.value,
          newPasswordConfirm = formControl.newPasswordConfirm.value;
    this.validations.usablePassword = !this.checkSamePassword(oldPassword, newPassword);
    this.validations.confirmPassword = this.checkSamePassword(newPassword, newPasswordConfirm);
  }

  // 變更個人資訊
  public updateProfile() {
    const formControl = this.getUpdateProfileFormControl(),
          payload = new Users.UpdateData({
            id: this.user.id,
            firstName: formControl.firstName.value,
            lastName: formControl.lastName.value
          })
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.UpdateData(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(data => {
        localStorage.removeItem(this.tokenKey);
        localStorage.setItem(this.tokenKey, data.accessToken);
        alert(this.translateServ.instant('ALERT.UPDATE_PROFILE_SUCCESS'));
        this.spinnerState.dispatch(new CloseAction());
        this.authStore.dispatch(new TokenLogInAction());
      })
    ).subscribe();
  }

  // 變更密碼
  public changePassword() {
    const formControl = this.getChangePasswordFormControl(),
          payload = new Users.ResetPassword({
            id: this.user.id,
            oldPassword: formControl.oldPassword.value,
            newPassword: formControl.newPassword.value,
            newPasswordConfirm: formControl.newPasswordConfirm.value
          });
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.ResetPassword(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data),
      tap(() => {
        alert(this.translateServ.instant('ALERT.CHANGE_PASSWORD_SUCCESS'));
        this.spinnerState.dispatch(new CloseAction());
        this.logOut();
      })
    ).subscribe();
  }

  // 登出
  public logOut() {
    this.authStore.dispatch(new LogOutAction());
  }

  // Hover
  public onHover(state: boolean) {
    this.onHovering = state;
  }

  public clickSelectFile() {
    this.selectFileInput.nativeElement.click();
  }

  // 以 base64 格式讀取本地檔案
  public selectFile($event: any) {
    let reader: FileReader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onloadstart = () => {
      reader.onload = (e: any) => {
        if ( reader.readyState === 2 ) {
          this.avatarImg = reader.result as string;
          this.cd.markForCheck();
        }
      }
    }
  }

}
