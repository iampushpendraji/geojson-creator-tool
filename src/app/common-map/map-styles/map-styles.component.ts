import { Component, Input, OnInit } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';
import { MapServiceService } from 'src/app/services/map-service.service';
import { StyleServiceService } from 'src/app/services/style-service.service';

@Component({
  selector: 'app-map-styles',
  templateUrl: './map-styles.component.html',
  styleUrls: ['./map-styles.component.css']
})
export class MapStylesComponent implements OnInit {
  @Input() map: any;
  @Input() draw: any;
  geo_json_main;
  currentMapStyle: string = 'open-streets-map';
  showAboutUs: boolean;

  getRasterTile(tile: string) {
    return {
      'version': 8,
      'sources': {
        'raster-tiles': {
          'type': 'raster',
          'tiles': [tile],
          'tileSize': 256,
          'attribution':
            'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
        }
      },
      'layers': [
        {
          'id': 'simple-tiles',
          'type': 'raster',
          'source': 'raster-tiles',
          'minzoom': 0,
          'maxzoom': 22
        }
      ]
    }
  }
  constructor(private mapService: MapServiceService, private dataShareService: DataShareService, private styleService: StyleServiceService) { }

  ngOnInit(): void {
    this.dataShareService.getSourceData.subscribe(result => {
      this.geo_json_main = result;
    })
  }

  setMapStyle(styleType: string) {
    let timeOut = 0;
    this.removeSourceAndLayer();
    this.currentMapStyle = styleType;
    switch (styleType) {
      case 'maplibre-default':
        this.map.setStyle('https://demotiles.maplibre.org/style.json');
        timeOut = 2000;
        break;
      case 'open-streets-map':
        this.map.setStyle(this.mapService.style);
        break;
      case 'raster-tile':
        this.map.setStyle(this.getRasterTile('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'));
        break;
      case 'wikimedia':
        this.map.setStyle(this.getRasterTile('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'));
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.addExistingSource();
    }, timeOut);
  }

  removeSourceAndLayer() {
    this.mapService.removeLayerFn();
    this.mapService.removeSourceFn();
  }

  addExistingSource() {
    let counter = 0,
        removedMarkerGeoJson1 = { ...this.geo_json_main },
        removedMarkerGeoJson = JSON.parse(JSON.stringify(removedMarkerGeoJson1));
        if(this.geo_json_main){
          this.geo_json_main.features.forEach((element, index) => {
            if(element.geometry.type == 'marker') {
              removedMarkerGeoJson.features.splice(index - counter, 1);
              counter ++;
            }
          });
          this.mapService.addSourceFn(removedMarkerGeoJson);
          // this.styleService.setColorArrayData(this.map);
          this.styleService.setDataOnMap(this.map, this.geo_json_main, true, false);
        }
        else{
          this.mapService.addSourceFn();
          // this.styleService.setColorArrayData(this.map);
          // this.styleService.setDataOnMap(this.map, this.geo_json_main);
        }
  }

}
