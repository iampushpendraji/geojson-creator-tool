import { Component, OnInit, ViewChild } from '@angular/core';
import { MapCommonComponent } from 'src/app/common-map/map-common/map-common.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  map: any;
  draw: any;
  
  mapCommonComponent: MapCommonComponent;

  @ViewChild(MapCommonComponent) set content(content: MapCommonComponent) {
    if(content) {
      this.mapCommonComponent = content;
    }
  }

  identityFeatureData: any;

  constructor() { }

  ngOnInit(): void {
  }

  getMapData(mapData) {
    this.map = mapData.map;
    this.draw = mapData.draw;
  }

  sendIdentityFeatureDataFn(data: any){
    this.mapCommonComponent.sendIdentityFeatureData(data);
  }

}
