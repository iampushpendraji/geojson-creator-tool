import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonMapRoutingModule } from './common-map-routing.module';
import { MapCommonComponent } from './map-common/map-common.component';
import { GeocoderComponent } from './geocoder/geocoder.component';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { FormsModule } from '@angular/forms';
import { CommonModuleModule } from '../common-module/common-module.module';
import { MapStylesComponent } from './map-styles/map-styles.component';


@NgModule({
  declarations: [
    MapCommonComponent,
    GeocoderComponent,
    MapStylesComponent
  ],
  imports: [
    CommonModule,
    CommonMapRoutingModule,
    NgMaterialModule,
    FormsModule,
    CommonModuleModule
  ],
  exports: [
    MapCommonComponent,
    MapStylesComponent
  ]
})
export class CommonMapModule { }
