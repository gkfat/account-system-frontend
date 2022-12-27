import { FormMaterialModule } from 'src/app/form-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DashboardComponent },
]

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    NgbModule,
    SharedModule,
    PipesModule,
    CommonModule,
    FormMaterialModule,
    RouterModule.forChild(routes),
  ]
})
export class DashboardModule { }
