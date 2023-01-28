import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MapCommonComponent } from 'src/app/common-map/map-common/map-common.component';
import { DataShareService } from 'src/app/services/data-share.service';
import { DownloadDataService } from 'src/app/services/download-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  showMessage($event) {
    if (this.temp_geo_json_main.features.length === 0) {
      return
    } else {
      $event.returnValue = 'Your data will be lost!';
    }

  }
  showGeocoder: boolean = false;
  map: any;
  draw: any;
  temp_geo_json_main: any = {
    type: "FeatureCollection",
    features: [],
  };
  mapCommonComponent: MapCommonComponent;

  @ViewChild(MapCommonComponent) set content(content: MapCommonComponent) {
    if (content) {
      this.mapCommonComponent = content;
    }
  }

  identityFeatureData: any;

  constructor(private dataShareService: DataShareService, private downloadDataService: DownloadDataService) { }

  ngOnInit(): void {
    this.dataShareService.getSourceData.subscribe((data: any) => {
      this.temp_geo_json_main = data;
    });
    this.downloadDataService.downloadDone.subscribe((data: any) => {
      this.temp_geo_json_main = {
        type: "FeatureCollection",
        features: [],
      }
    });
  }

  getMapData(mapData) {
    this.map = mapData.map;
    this.draw = mapData.draw;
  }

  sendIdentityFeatureDataFn(data: any) {
    this.mapCommonComponent.sendIdentityFeatureData(data);
  }

  getShowGeocoderStatus(status: any){
    this.showGeocoder = status;
  }

}
