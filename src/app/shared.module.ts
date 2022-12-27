import { ApiServiceModule } from './api/api.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ApiServiceModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
  ]
})
export class SharedModule { }
