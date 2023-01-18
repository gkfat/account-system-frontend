import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { NewsComponent } from './news.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: NewsComponent },
]

@NgModule({
  declarations: [
    NewsComponent
  ],
  imports: [
    SharedModule,
    PipesModule,
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ]
})
export class NewsModule { }
