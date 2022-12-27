import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersService } from './users.service';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    UsersService,
    ErrorHandlerService
  ]
})
export class ApiServiceModule { }
