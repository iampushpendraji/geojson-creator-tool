import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { CommonMapModule } from '../common-map/common-map.module';
import { NgMaterialModule } from '../ng-material/ng-material.module';
import { CommonModuleModule } from '../common-module/common-module.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CommonMapModule,
    NgMaterialModule,
    CommonModuleModule
  ]
})
export class HomeModule { }
