import { ApiServiceModule } from './api/api.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormMaterialModule } from './form-material.module';
import { NgbModule, NgbNavModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  imports: [
    PipesModule,
    FormsModule,
    FormMaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    ApiServiceModule,
    NgbModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgxDropzoneModule,
    AngularEditorModule
  ],
  exports: [
    FormsModule,
    FormMaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    NgbNavModule,
    NgbProgressbarModule,
    NgxDropzoneModule,
    AngularEditorModule
  ],
  providers: [
  ]
})
export class SharedModule { }
