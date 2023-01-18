import { ComponentsModule } from 'src/app/components/components.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'timeline', pathMatch: 'full' },
      {
        path: 'timeline',
        component: TimelineComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    UserComponent,
    TimelineComponent
  ],
  imports: [
    SharedModule,
    PipesModule,
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ]
})
export class UserModule { }
