import { RoutesModule } from './routes/routes.module';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RoutesModule,
    RouterModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class LayoutModule { }
