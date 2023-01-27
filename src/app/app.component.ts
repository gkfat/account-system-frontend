import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './components/base.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthState, selectState, TokenLogInAction } from 'src/app/store/auth';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { Users } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectState);
  public user: Users.User | null = null;
  private tokenKey: string = environment.storageTokenKey;

  constructor(
    private translateServ: TranslateService,
    private authStore: Store<AuthState>,
    private socialAuthServ: SocialAuthService
  ) { super(); }

  ngOnInit() {
    const accessToken = localStorage.getItem(this.tokenKey);
    if ( accessToken ) {
      this.authStore.dispatch(new TokenLogInAction());
    }
    this.setTranslate();
    this.authListener();
  }

  private setTranslate() {
    this.translateServ.addLangs(['zh-TW', 'en']);
    let defaultLang = environment.location === 'TW' ? 'zh-TW' : 'en';
    this.translateServ.setDefaultLang(defaultLang);
  }

  // 監聽登入
  private authListener() {
    this.auth$.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        this.user = state.user;
        console.log('user:', this.user);
      }),
      switchMap(() => this.socialAuthServ.initState),
      switchMap(() => this.socialAuthServ.authState),
      tap(socialUser => {
        let accessToken = localStorage.getItem(this.tokenKey);
        if ( socialUser && !this.user && accessToken ) {
          this.authStore.dispatch(new TokenLogInAction());
        }
      }),
    ).subscribe();
  }

}
