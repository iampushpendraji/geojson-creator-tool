import { EventEmitter, Injectable } from '@angular/core';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import FreehandMode from 'mapbox-gl-draw-freehand-mode';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import DrawLineFreehand from 'mapbox-gl-draw-line-freehand';
import RotateMode from 'mapbox-gl-draw-rotate-mode';
import * as maplibregl from 'maplibre-gl';
import * as turf from '@turf/turf';
import * as numeral from 'numeral';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {
  getCircleFeature: EventEmitter<any> = new EventEmitter<any>();
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

  DrawCircle: any;
  setDrawCircleMode() {

    const getDisplayMeasurements = (feature) => {
      // should log both metric and standard display strings for the current drawn feature

      // metric calculation
      const drawnLength = (turf.length(feature) * 1000); // meters

      let metricUnits = 'm';
      let metricFormat = '0,0';
      let metricMeasurement;

      let standardUnits = 'ft';
      let standardFormat = '0,0';
      let standardMeasurement;

      metricMeasurement = drawnLength;
      if (drawnLength >= 1000) { // if over 1000 meters, upgrade metric
        metricMeasurement = drawnLength / 1000;
        metricUnits = 'km';
        metricFormat = '0.00';
      }

      standardMeasurement = drawnLength * 3.28084;
      if (standardMeasurement >= 5280) { // if over 5280 feet, upgrade standard
        standardMeasurement /= 5280;
        standardUnits = 'mi';
        standardFormat = '0.00';
      }

      const displayMeasurements = {
        metric: `${numeral(metricMeasurement).format(metricFormat)} ${metricUnits}`,
        standard: `${numeral(standardMeasurement).format(standardFormat)} ${standardUnits}`,
      };
      return displayMeasurements;
    }

    const circleFromTwoVertexLineString = (geojson) => {

      const center = geojson.geometry.coordinates[0];
      const radiusInKm = turf.lineDistance(geojson);

      return turf.circle(center, radiusInKm);
    }

    const CircleMode = {
      ...MapboxDraw.modes.draw_line_string,

      clickAnywhere: function (state, e) {
        // this ends the drawing after the user creates a second point, triggering this.onStop
        if (state.currentVertexPosition === 1) {
          state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
          return this.changeMode('simple_select', { featureIds: [state.line.id] });
        }

        state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
        if (state.direction === 'forward') {
          state.currentVertexPosition += 1;
          state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
        } else {
          state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
        }

        return null;
      },

      onStop: (state) => {

        // remove last added coordinate
        state.line.removeCoordinate('0');
        if (state.line.isValid()) {
          const lineGeoJson = state.line.toGeoJSON();
          const circleFeature = circleFromTwoVertexLineString(lineGeoJson);
          this.getCircleFeature.emit(JSON.parse(JSON.stringify({...circleFeature})));
          this.map.fire('draw.create', {
            features: [circleFeature],
          });
          this.draw.deleteAll()
        } else {
          // this.draw.deleteFeature([state.line.id], { silent: true });
          // this.draw.changeMode('simple_select', {}, { silent: true });
          this.draw.deleteAll()
        }
      },

      toDisplayFeatures: function (state, geojson, display) {

        // Only render the line if it has at least one real coordinate
        if (geojson.geometry.coordinates.length < 2) return null;

        display({
          type: 'Feature',
          properties: {
            active: 'true'
          },
          geometry: {
            type: 'Point',
            coordinates: geojson.geometry.coordinates[0],
          },
        });

        // displays the line as it is drawn
        geojson.properties.active = 'true';
        display(geojson);

        const displayMeasurements = getDisplayMeasurements(geojson);

        // create custom feature for the current pointer position
        const currentVertex = {
          type: 'Feature',
          properties: {
            meta: 'currentPosition',
            radius: `${displayMeasurements.metric} ${displayMeasurements.standard}`,
            parent: state.line.id,
          },
          geometry: {
            type: 'Point',
            coordinates: geojson.geometry.coordinates[1],
          },
        };

        display(currentVertex);

        const circleFeature = circleFromTwoVertexLineString(geojson);

        circleFeature.properties = {
          active: 'true'
        };

        display(circleFeature);

        return null;
      }
    };

    return CircleMode

  }

  constructor() { }

  initializeDraw() {
    this.DrawCircle = this.setDrawCircleMode();
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      modes: Object.assign(MapboxDraw.modes, {
        draw_radius: this.DrawCircle,
        draw_freehand: FreehandMode,
        draw_rectangle: DrawRectangle,
        draw_freehand_line: DrawLineFreehand,
        rotate_mode: RotateMode
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
        'fill-color': '#10CAF0',
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
