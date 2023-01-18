import { PostsService } from './posts.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersService } from './users.service';
import { ErrorHandlerService } from './error-handler.service';
import { DecoratorsService } from './decorators.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    UsersService,
    PostsService,
    DecoratorsService,
    ErrorHandlerService
  ]
})
export class ApiServiceModule { }
