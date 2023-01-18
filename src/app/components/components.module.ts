import { UserInfoComponent } from './userInfo/user-info.component';
import { PostComponent } from './post/post.component';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { PromptTextComponent } from './promptText/prompt-text.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SpinnerComponent,
    PromptTextComponent,
    PostComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  exports: [
    SpinnerComponent,
    PromptTextComponent,
    PostComponent,
    UserInfoComponent
  ]
})
export class ComponentsModule { }
