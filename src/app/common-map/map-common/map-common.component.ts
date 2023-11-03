import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IdentityFeatureSideNavComponent } from 'src/app/common-module/identity-feature-side-nav/identity-feature-side-nav.component';
import { MapServiceService } from 'src/app/services/map-service.service';

@Component({
  selector: 'app-map-common',
  templateUrl: './map-common.component.html',
  styleUrls: ['./map-common.component.css'],
})
export class MapCommonComponent implements OnInit {
  // @Input() showGeocoder: boolean = false;
  @Output() mapDataEmit: EventEmitter<any> = new EventEmitter<any>();

  identityFeatureSideNavCompontent: IdentityFeatureSideNavComponent;
  @ViewChild(IdentityFeatureSideNavComponent) set content(content: IdentityFeatureSideNavComponent) {
    if (content) {
      this.identityFeatureSideNavCompontent = content;
    }
  }

  showSpinner: boolean = true;
  map: any;
  draw: any;
  
  constructor(private mapService: MapServiceService) { }

  ngOnInit(): void {
    this.mapService.initializeDraw();
    this.mapService.initializeMap('map');
    this.mapService.addControlsOnMap();
    this.map = this.mapService.getMapData().map;
    this.draw = this.mapService.getMapData().draw;
    this.mapDataEmit.emit({ map: this.map, draw: this.draw });
    this.handleSpinner();
  }

  handleSpinner() {
    this.map.on('load', () => {
      this.mapService.addSourceFn();
    });

    this.map.on('idle', () => {
      this.showSpinner = false;
    });

    this.map.on('zoom', () => {
      this.showSpinner = true;
    });

    this.map.on('dragpen', () => {
      this.showSpinner = true;
    });

    // Map outer fog style
    // this.map.on('style.load', () => {
    //   this.map.setFog({
    //     color: 'rgb(186, 210, 235)', // Lower atmosphere
    //     'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
    //     'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
    //     'space-color': 'rgb(11, 11, 25)', // Background color
    //     'star-intensity': 0.1 // Background star brightness (default 0.35 at low zoooms )
    //   });
    // });

  }

  sendIdentityFeatureData(data: any) {
    this.identityFeatureSideNavCompontent.showIdentity(data);
  }

}
