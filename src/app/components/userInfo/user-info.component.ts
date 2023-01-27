import { DecoratorsService } from 'src/app/api/decorators.service';
import { switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { Users, Decorators } from 'src/app/core/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CloseAction, OpenAction, SpinnerState } from 'src/app/store/spinner/index';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { of, tap, catchError, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { UsersService } from 'src/app/api/users.service';
import { ErrorHandlerService } from 'src/app/api/error-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthState, LogOutAction, selectState, TokenLogInAction } from 'src/app/store/auth';
import { environment } from 'src/environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  @Input() inputUser!: Users.User | null;
  @Input() isUserSelf: boolean = false;
  @Input() classes: string = '';
  @Input() showName: boolean = true;
  @Input() showExp: boolean = true;
  @Input() size: 'sm' | 'md' = 'md';
  @Input() showConfigIcon: boolean = true;

  public displayUser: Users.User | null = null;

  private auth$ = this.authStore.select(selectState);
  public user: Users.User | null = null;
  private tokenKey: string = environment.storageTokenKey;
  private decoratorsKey: string = environment.storageDecoratorsKey;

  // 編輯使用者資料 Modal
  @ViewChild('modal') modal!: ElementRef;
  public modalRef!: NgbModalRef;

  public avatarSelection: Decorators.Decorator[] = [];
  public frameSelection: Decorators.Decorator[] = [];

  // Update profile form
  public updateProfileForm: UntypedFormGroup = this.formBuilder.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickName: null,
      avatar: this.avatarSelection[0],
      frame: this.frameSelection[0],
    });
  // Change password form
  public changePasswordForm: UntypedFormGroup = this.formBuilder.group(
    {
      id: 0,
      email: '',
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        // Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        Validators.pattern(/^(?=.*?[a-z]|[A-Z])(?=.*?[0-9]).{8,}$/)
      ]],
      newPasswordConfirm: ['', Validators.required]
  });
  
  public validations = {
    usablePassword: false,
    confirmPassword: false
  }

  constructor(
    private cd: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private spinnerState: Store<SpinnerState>,
    private usersServ: UsersService,
    private errServ: ErrorHandlerService,
    private translateServ: TranslateService,
    private authStore: Store<AuthState>,
    private socialAuthServ: SocialAuthService,
    private modalServ: NgbModal
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
      tap(state => {
        if ( state.user ) {
          this.user = state.user;
        }
        if ( this.inputUser ) {
          this.displayUser = new Users.User(this.inputUser);
        } else {
          this.displayUser = new Users.User(this.user);
        }
        this.fetchDecorators();
      })
    ).subscribe();
  }

  public fetchDecorators() {
    const storage = localStorage.getItem(this.decoratorsKey);
    if ( storage ) {
      const decorators: Decorators.Decorator[] = JSON.parse(storage);
      decorators.forEach(d => {
        d.categoryId === 0 ? this.avatarSelection.push(d) : this.frameSelection.push(d);
      })
      const findAvatar = this.avatarSelection.filter(a => a.id === this.displayUser!.avatarId),
            findFrame = this.frameSelection.filter(f => f.id === this.displayUser!.frameId);
      findAvatar.length > 0 ? this.displayUser!.avatar = findAvatar[0] : null;
      findFrame.length > 0 ? this.displayUser!.frame = findFrame[0] : null;
    }
    this.cd.markForCheck();
  }

  /*
  ** Validators
  */
  public getUpdateProfileFormControl(): {
    nickName: AbstractControl,
    firstName: AbstractControl,
    lastName: AbstractControl,
    avatar: AbstractControl,
    frame: AbstractControl
  } {
    return {
      nickName: this.updateProfileForm.get('nickName')!,
      lastName: this.updateProfileForm.get('lastName')!,
      firstName: this.updateProfileForm.get('firstName')!,
      avatar: this.updateProfileForm.get('avatar')!,
      frame: this.updateProfileForm.get('frame')!,
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
          payload = new Users.UpdateUser({
            id: this.displayUser!.id,
            firstName: formControl.firstName.value,
            lastName: formControl.lastName.value,
            nickName: formControl.nickName.value,
            avatarId: formControl.avatar.value.id,
            frameId: formControl.frame.value.id,
          })
    this.spinnerState.dispatch(new OpenAction(''));
    this.usersServ.UpdateUser(payload).pipe(
      takeUntil(this.unsubscribe$),
      catchError(err => {
        this.errServ.HttpErrorHandle(err);
        this.spinnerState.dispatch(new CloseAction());
        return of();
      }),
      map(res => res.data.accessToken),
      tap(accessToken => {
        localStorage.removeItem(this.tokenKey);
        localStorage.setItem(this.tokenKey, accessToken);
        this.inputUser = null;
        this.displayUser = null;
        this.cd.markForCheck();
        this.authStore.dispatch(new TokenLogInAction());
        alert(this.translateServ.instant('ALERT.UPDATE_PROFILE_SUCCESS'));
        this.modalRef.close();
        this.spinnerState.dispatch(new CloseAction());
      })
    ).subscribe();
  }

  // 變更密碼
  public changePassword() {
    const formControl = this.getChangePasswordFormControl(),
          payload = new Users.ResetPassword({
            id: this.displayUser!.id,
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
    this.socialAuthServ
      .signOut(true).then().catch()
      .finally(() => this.authStore.dispatch(new LogOutAction()));
  }

  /*
  ** Modal
  */
  public openModal(user: Users.User) {
    if ( user ) {
      const findAvatar = this.avatarSelection.filter(a => a.id === this.user!.avatarId),
      findFrame = this.frameSelection.filter(f => f.id === this.user!.frameId);
      this.updateProfileForm.patchValue({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickName: user.nickName,
        avatar: findAvatar.length > 0 ? findAvatar[0] : this.avatarSelection[0],
        frame: findFrame.length > 0 ? findFrame[0] : this.frameSelection[0]
      });
    }
    this.modalRef = this.modalServ.open(this.modal, { size: 'lg' });
  }

  public selectDecorator(decorator: Decorators.Decorator) {
    if ( decorator.categoryId === 0 ) {
      this.updateProfileForm.patchValue({ avatar: decorator });
    } else {
      this.updateProfileForm.patchValue({ frame: decorator });
    }
  }

  public getClass(decorator: Decorators.Decorator) {
    const formControl = this.getUpdateProfileFormControl();
    let klass: string[] = [];
    if ( decorator.categoryId === 0 ) {
      klass = formControl.avatar.value.id === decorator.id && decorator.levelLimit <= this.user!.level ? ['selected'] : klass;
    } else {
      klass = formControl.frame.value.id === decorator.id && decorator.levelLimit <= this.user!.level ? ['selected'] : klass;
    }
    klass = decorator.levelLimit > this.user!.level ? [...klass, 'disabled'] : klass;
    return klass.join(' ');
  }

}
