import { Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import FreehandMode from 'mapbox-gl-draw-freehand-mode';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import DrawLineFreehand from 'mapbox-gl-draw-line-freehand';
import * as maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  map: maplibregl.Map | undefined;
  draw: any;
  style: any = {
    "version": 8,
    "sources": {
      "osm": {
        "type": "raster",
        "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
        "tileSize": 256,
        "attribution": "&copy; OpenStreetMap Contributors",
        "maxzoom": 19
      }
    },
    "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    "layers": [
      {
        "id": "osm",
        "type": "raster",
        "source": "osm" // This must match the source key above
      }
    ]
  };
  constructor() { }

  initializeDraw() {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      modes: Object.assign(MapboxDraw.modes, {
        draw_freehand: FreehandMode,
        draw_rectangle: DrawRectangle,
        draw_freehand_line: DrawLineFreehand
      })
    });
  }

  initializeMap(mapContainer: string) {
    this.map = new maplibregl.Map({
      container: mapContainer, // container id
      // 'https://demotiles.maplibre.org/style.json', // style URL
      center: [0, 0],
      zoom: 1
    });
    this.map.setStyle(this.style);
  }

  initializeGeolocator() {
    const geoLocator = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
    return geoLocator
  }

  addControlsOnMap() {
    this.map?.addControl(new maplibregl.FullscreenControl(), 'bottom-left');
    this.map?.addControl(new maplibregl.NavigationControl(), 'bottom-left');
    this.map?.addControl(this.initializeGeolocator(), 'bottom-left')
    this.map?.addControl(this.draw, 'bottom-left');
  }

  getMapData() {
    if (this.map == undefined || this.draw == undefined) {
      console.log('Error -------------- >>   Map and Draw is undefined')
      return undefined
    }
    else {
      return { map: this.map, draw: this.draw }
    }
  }

  removeLayerFn() {
    this.map.removeLayer('YourMapSourceIdLineString');
    this.map.removeLayer('YourMapSourceIdPolygon');
    this.map.removeLayer('YourMapSourceIdPoint');
    this.map.removeLayer('YourMapSourceIdPolygonLineString');
  }

  removeSourceFn() {
    this.map.removeSource('YourMapSource');
  }

  addSourceFn(data: any = { "type": "FeatureCollection", "features": [] }) {
    this.map.addSource('YourMapSource', {
      'type': 'geojson',
      'data': data
    })
    this.addLayerFn()
  }

  addLayerFn() {
    this.map.addLayer({
      'id': 'YourMapSourceIdLineString',
      'type': 'line',
      'source': 'YourMapSource',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#572d06',
        'line-width': 2
      },
      'filter': ['==', '$type', 'LineString']
    });

    this.map.addLayer({
      'id': 'YourMapSourceIdPolygon',
      'type': 'fill',
      'source': 'YourMapSource',
      'paint': {
        'fill-color': '#ed811c',
        'fill-opacity': 0.4
      },
      'filter': ['==', '$type', 'Polygon']
    });

    this.map.addLayer({
      'id': 'YourMapSourceIdPoint',
      'type': 'circle',
      'source': 'YourMapSource',
      'paint': {
        'circle-radius': 6,
        'circle-color': '#B42222'
      },
      'filter': ['==', '$type', 'Point']
    });

    this.map.addLayer({
      'id': 'YourMapSourceIdPolygonLineString',
      'type': 'line',
      'source': 'YourMapSource',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#3b1513',
        'line-width': 2
      },
      'filter': ['==', '$type', 'Polygon']
    });

  }

  addLabelFn(data: any) {
    this.map.addSource('YourMapLabelSource', {
      'type': 'geojson',
      'data': data
    })
    this.map.addLayer({
      'id': 'YourMapSourceLabels',
      'type': 'symbol',
      'source': 'YourMapLabelSource',
      'layout': {
        'text-font': ['Open Sans Bold'],
        'text-field': ['get', 'featureid'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.5,
        'text-justify': 'center',
        'icon-image': ['concat', ['get', 'icon'], '-15'],
        'text-size': 15,
        "text-optional": false,
      },
      paint: {
        'text-color': 'red',
        "text-halo-color": "lightpink",
        "text-halo-width": 1
      }
    });
    // this.map.setLayoutProperty('YourMapSourceLabels', 'text-size', 25);
  }

  removeLabelFn() {
    this.map.removeLayer('YourMapSourceLabels');
    this.map.removeSource('YourMapLabelSource');
  }

}
