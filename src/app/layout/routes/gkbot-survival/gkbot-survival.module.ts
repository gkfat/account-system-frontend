import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { GkbotSurvivalComponent } from './gkbot-survival.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: GkbotSurvivalComponent },
]

@NgModule({
  declarations: [
    GkbotSurvivalComponent
  ],
  imports: [
    SharedModule,
    PipesModule,
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class GkbotSurvivalModule { }
