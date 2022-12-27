import { FormMaterialModule } from 'src/app/form-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ProfileComponent },
]

@NgModule({
  declarations: [
    ProfileComponent
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
export class ProfileModule { }
