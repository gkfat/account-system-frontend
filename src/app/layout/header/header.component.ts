import { switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base.component';
import { Users } from 'src/app/core/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerState } from 'src/app/store/spinner/index';
import { Store } from '@ngrx/store';
import { AuthState, LogOutAction, selectState } from 'src/app/store/auth';
import { tap, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectState);
  public user: Users.User | null = null;

  public langs: string[] = this.translateServ.langs; 
  public currentLang: string = this.langs[0];

  public isCollapsed: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private translateServ: TranslateService,
    private spinnerState: Store<SpinnerState>,
    private router: Router,
    private authStore: Store<AuthState>,
    private socialAuthServ: SocialAuthService
  ) { super(); }

  ngOnInit() {
    this.authListener();
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        this.user = state.user;
        this.cd.markForCheck();
      })
    ).subscribe();
  }

  public setTranslate(lang: string) {
    this.translateServ.setDefaultLang(lang);
    this.currentLang = lang;
  }

  // 登出
  public logOut() {
    this.socialAuthServ.initState.pipe(
      takeUntil(this.unsubscribe$),
      tap(() => this.authStore.dispatch(new LogOutAction())),
      switchMap(() => this.socialAuthServ.authState),
      tap(user => {
        if (user) {
          this.socialAuthServ.signOut(true);
        }
      }),
    ).subscribe();
  }

}
