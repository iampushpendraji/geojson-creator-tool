import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModuleRoutingModule } from './common-module-routing.module';
import { DrawCommonComponent } from './draw-common/draw-common.component';
import { HeaderComponent } from './header/header.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { CreateDataComponent } from './create-data/create-data.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { DataTableComponent } from './data-table/data-table.component';
import { PrettyjsonPipe } from './prettyjson.pipe';
import { IdentityFeatureSideNavComponent } from './identity-feature-side-nav/identity-feature-side-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconListDialogComponent } from './icon-list-dialog/icon-list-dialog.component';
import { TextEditComponent } from './text-edit/text-edit.component';


@NgModule({
  declarations: [
    DrawCommonComponent,
    HeaderComponent,
    CreateDataComponent,
    UploadDataComponent,
    DataTableComponent,
    PrettyjsonPipe,
    IdentityFeatureSideNavComponent,
    ConfirmBoxComponent,
    IconListDialogComponent,
    TextEditComponent
  ],
  imports: [
    CommonModule,
    CommonModuleRoutingModule,
    NgMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ColorPickerModule
  ],
  exports: [
    DrawCommonComponent,
    HeaderComponent,
    CreateDataComponent,
    UploadDataComponent,
    DataTableComponent,
    IdentityFeatureSideNavComponent,
    ConfirmBoxComponent
  ],
})
export class CommonModuleModule { }
