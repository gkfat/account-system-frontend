import { FormMaterialModule } from './../form-material.module';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { PromptTextComponent } from './promptText/prompt-text.component';


@NgModule({
  declarations: [
    SpinnerComponent,
    PromptTextComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormMaterialModule
  ],
  exports: [
    SpinnerComponent,
    PromptTextComponent
  ]
})
export class ComponentsModule { }
