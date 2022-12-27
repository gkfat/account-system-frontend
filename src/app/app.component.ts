import { takeUntil, tap } from 'rxjs/operators';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from './components/base.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthState, selectState, TokenLogInAction } from 'src/app/store/auth';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  private auth$ = this.authStore.select(selectState);
  public accessToken: string | null = null;

  constructor(
    private translateServ: TranslateService,
    private authStore: Store<AuthState>,
    private socialAuthServ: SocialAuthService
  ) { super(); }

  ngOnInit() {
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
    this.auth$.subscribe(state => this.accessToken = state.accessToken);
    this.socialAuthServ.initState.pipe(
      takeUntil(this.unsubscribe$),
      tap(state => {
        // Check if stored accessToken
        if ( state ) {
          const accessToken = localStorage.getItem(environment.cookieKeys.token) || null;
          if ( accessToken ) {
            console.log('Token log in');
            this.authStore.dispatch(new TokenLogInAction());
          }
        }
      }),
    ).subscribe();
  }

}
