import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
import { CommonModule } from '@angular/common';
import { ApiServiceModule } from 'src/app/api/api.module';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { LogInComponent } from './log-in.component';
import { RouterModule, Routes } from '@angular/router';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

const routes: Routes = [
  {
    path: '', component: LogInComponent
  }
]

@NgModule({
  declarations: [
    LogInComponent,
  ],
  imports: [
    SharedModule,
    PipesModule,
    CommonModule,
    ApiServiceModule,
    RouterModule.forChild(routes),
    SocialLoginModule,
    CoolSocialLoginButtonsModule
  ]
})
export class LogInModule { }
