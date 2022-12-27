import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { store, effects } from './store/store-register';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared.module';
import { FormMaterialModule } from './form-material.module'; 
import { LayoutModule } from './layout/layout.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, GoogleInitOptions } from '@abacritt/angularx-social-login';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/');
}

export const googleLoginOptions: GoogleInitOptions = {
  scopes: 'profile email',
  prompt: 'none',
};

export const socialLoginConfig = [
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.clientId.google, googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.clientId.facebook)
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    LayoutModule,
    RouterModule.forRoot([], {
      preloadingStrategy: PreloadAllModules,
      useHash: false,
      scrollPositionRestoration: 'top'
    }),
    HttpClientModule,
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(store),
    ComponentsModule,
    SharedModule,
    FormMaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: socialLoginConfig,
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
