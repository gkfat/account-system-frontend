import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard/auth-guard.service';
import { TokenInterceptor } from './interceptors/token-interceptor';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule {
}
