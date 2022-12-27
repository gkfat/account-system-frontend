import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { FormMaterialModule } from '../form-material.module';

@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    FormMaterialModule,
    RoutesModule,
    RouterModule,
    ComponentsModule,
    SharedModule,
    NgbModule
  ],
})
export class LayoutModule { }
