import { CommonModule } from '@angular/common';
import { ApiServiceModule } from 'src/app/api/api.module';
import { FormMaterialModule } from 'src/app/form-material.module';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { VerifyComponent } from './verify.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: VerifyComponent
  }
]

@NgModule({
  declarations: [
    VerifyComponent
  ],
  imports: [
    SharedModule,
    FormMaterialModule,
    PipesModule,
    CommonModule,
    ApiServiceModule,
    RouterModule.forChild(routes),
  ]
})
export class VerifyModule { }
