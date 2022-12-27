import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { FormMaterialModule } from '../../form-material.module';
import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BrowserModule,
    SharedModule,
    FormMaterialModule,
  ],
  declarations: [
  ],
})
export class RoutesModule { }
