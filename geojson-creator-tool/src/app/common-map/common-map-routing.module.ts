import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapCommonComponent } from './map-common/map-common.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonMapRoutingModule { }
