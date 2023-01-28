import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as maplibregl from 'mapbox-gl';
import { TextEditComponent } from '../common-module/text-edit/text-edit.component';
import { DataShareService } from './data-share.service';
import { IdentityFeatureServiceService } from './identity-feature-service.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class StyleServiceService {
  map: any;
  geo_json_main: any;
  canDeleteMarker: boolean = false;
  newMarkerGeoJSON: any = {
    type: 'FeatureCollection',
    features: [],
  };
  fillColorArray: any = [];
  // outLineColorArray: any = [];
  fillOpacityArray: any = [];
  fillBorderColorArray: any = [];

  lineColorArray: any = [];
  lineWidthArray: any = [];

  circleRadiusArray: any = [];
  circleColorArray: any = [];

  constructor(private snackBarService: SnackbarService, private matDialog: MatDialog, private dataShareService: DataShareService, private identityFeatureService: IdentityFeatureServiceService) {
    this.dataShareService.getSourceData.subscribe((data) => {
      this.geo_json_main = data;
    });
  }
  fillBorderWidthArray = [];
  setColorArrayData(map: any) {
    this.fillColorArray = [];
    // this.outLineColorArray = [];
    this.fillOpacityArray = [];
    this.fillBorderColorArray = [];
    this.fillBorderWidthArray = [];
    this.lineColorArray = [];
    this.lineWidthArray = [];
    this.circleColorArray = [];
    this.circleRadiusArray = [];
    this.map = map;
    if (this.geo_json_main) {
      this.geo_json_main.features.forEach(m => {
        if (m.styledetails.styledata.circlecolor !== undefined) {
          this.circleColorArray.push(m.id)
          this.circleColorArray.push(m.styledetails.styledata.circlecolor)
        }
        if (m.styledetails.styledata.circleradius !== undefined) {
          this.circleRadiusArray.push(m.id)
          this.circleRadiusArray.push(Number(m.styledetails.styledata.circleradius))
        }
        if (m.styledetails.styledata.linecolor !== undefined) {
          this.lineColorArray.push(m.id)
          this.lineColorArray.push(m.styledetails.styledata.linecolor)
        } if (m.styledetails.styledata.linewidth !== undefined) {
          this.lineWidthArray.push(m.id)
          this.lineWidthArray.push(Number(m.styledetails.styledata.linewidth))
        }
        if (m.styledetails.styledata.fillcolor !== undefined) {
          this.fillColorArray.push(m.id)
          this.fillColorArray.push(m.styledetails.styledata.fillcolor)
        }
        if (m.styledetails.styledata.fillbordercolor !== undefined) {
          this.fillBorderColorArray.push(m.id)
          this.fillBorderColorArray.push(m.styledetails.styledata.fillbordercolor)
        }
        if (m.styledetails.styledata.fillopacity !== undefined) {
          this.fillOpacityArray.push(m.id)
          this.fillOpacityArray.push(Number(m.styledetails.styledata.fillopacity))
        }
        if (m.styledetails.styledata.fillborderwidth !== undefined) {
          this.fillBorderWidthArray.push(m.id)
          this.fillBorderWidthArray.push(Number(m.styledetails.styledata.fillborderwidth))
        }

        // For Dummy Data

        if (m.styledetails.styledata.circlecolor == undefined) {
          this.circleColorArray.push(m.id)
          this.circleColorArray.push('orange')
        }
        if (m.styledetails.styledata.circleradius == undefined) {
          this.circleRadiusArray.push(m.id)
          this.circleRadiusArray.push(5)
        }
        if (m.styledetails.styledata.linecolor == undefined) {
          this.lineColorArray.push(m.id)
          this.lineColorArray.push('orange')
        }
        if (m.styledetails.styledata.linewidth == undefined) {
          this.lineWidthArray.push(m.id)
          this.lineWidthArray.push(5)
        }
        if (m.styledetails.styledata.fillopacity == undefined) {
          this.fillOpacityArray.push(m.id)
          this.fillOpacityArray.push(5)
        }
        if (m.styledetails.styledata.fillbordercolor == undefined) {
          this.fillBorderColorArray.push(m.id)
          this.fillBorderColorArray.push('#3b1513')
        }
        if (m.styledetails.styledata.fillcolor == undefined) {
          this.fillColorArray.push(m.id)
          this.fillColorArray.push('orange')
        }
        if (m.styledetails.styledata.fillborderwidth == undefined) {
          this.fillBorderWidthArray.push(m.id)
          this.fillBorderWidthArray.push(2)
        }
      })
      this.setLastElementInEachStyle();
    }
  }

  setLastElementInEachStyle() {
    this.circleColorArray.push('#B42222');
    this.circleRadiusArray.push(6);
    this.lineColorArray.push('#BF93E4');
    this.lineWidthArray.push(5);
    this.fillColorArray.push('#10CAF0');
    this.fillBorderColorArray.push('#3b1513');
    this.fillBorderWidthArray.push(2);
    this.fillOpacityArray.push(0.4);
    this.setPaintFinally();
  }

  setPaintFinally() {
    // For Polygon Fill Color
    this.map.setPaintProperty(
      'YourMapSourceIdPolygon',
      'fill-color',
      this.paintArrayCreator('fill-color')
    )

    // For Polygon Fill Opacity
    this.map.setPaintProperty(
      'YourMapSourceIdPolygon',
      'fill-opacity',
      this.paintArrayCreator('fill-opacity')
    )

    // For Polygon Out-Line-Color
    // this.map.setPaintProperty(
    //   'YourMapSourceIdPolygon',
    //   'fill-outline-color',
    //   this.paintArrayCreator('fill-outline-color')
    // )

    // For Polygon Border Color
    this.map.setPaintProperty(
      'YourMapSourceIdPolygonLineString',
      'line-color',
      this.paintArrayCreator('polygon-border-color')
    )

    // For Polygon Border Width
    this.map.setPaintProperty(
      'YourMapSourceIdPolygonLineString',
      'line-width',
      this.paintArrayCreator('polygon-border-width')
    )

    // For Circle Color 
    this.map.setPaintProperty(
      'YourMapSourceIdPoint',
      'circle-color',
      this.paintArrayCreator('circle-color')
    )

    // For Circle Radius
    this.map.setPaintProperty(
      'YourMapSourceIdPoint',
      'circle-radius',
      this.paintArrayCreator('circle-radius')
    )

    // For Line Color
    this.map.setPaintProperty(
      'YourMapSourceIdLineString',
      'line-color',
      this.paintArrayCreator('line-color')
    )

    // For Line Width
    this.map.setPaintProperty(
      'YourMapSourceIdLineString',
      'line-width',
      this.paintArrayCreator('line-width')
    )
  }

  paintArrayCreator(type: string) {
    let paintArray = ['match', ['get', 'featureid']];
    if (type == 'fill-color') {
      paintArray.push(...this.fillColorArray);
    }
    if (type == 'fill-opacity') {
      paintArray.push(...this.fillOpacityArray);
    }
    if (type == 'polygon-border-color') {
      paintArray.push(...this.fillBorderColorArray);
    }
    if (type == 'polygon-border-width') {
      paintArray.push(...this.fillBorderWidthArray);
    }
    if (type == 'circle-color') {
      paintArray.push(...this.circleColorArray);
    }
    if (type == 'circle-radius') {
      paintArray.push(...this.circleRadiusArray);
    }
    if (type == 'line-color') {
      paintArray.push(...this.lineColorArray);
    }
    if (type == 'line-width') {
      paintArray.push(...this.lineWidthArray);
    }
    return paintArray;
  }

  setDataOnMap(map: any, geo_json_main: any, canDeleteMarkers = true, canSetDataState = true) {
    if (canSetDataState) {
      this.setDataSourceFn(JSON.parse(JSON.stringify({ ...geo_json_main })));
    }
    if (canDeleteMarkers) {
      this.deleteAllMarkers();
    }
    this.newMarkerGeoJSON = {
      type: 'FeatureCollection',
      features: [],
    };
    this.map = map;
    let geoJSON = { ...geo_json_main },
      index = geoJSON.features.findIndex(e => e.geometry.type == 'marker');
    if (index == -1) {
      this.map.getSource('YourMapSource').setData(geoJSON);
      if (geoJSON.features.length > 0) {
        this.setColorArrayData(this.map);
      }
    }
    else {
      this.seprateMarkerLayer(geoJSON);
    }
  }

  seprateMarkerLayer(geoJSON: any) {
    let newGeoJSON = JSON.parse(JSON.stringify(geoJSON));
    let indexes = [];
    // Adding marker object in newMarkerGeoJSON
    geoJSON.features.forEach((element, index) => {
      if (element.geometry.type == 'marker') {
        indexes.push(index);
        this.newMarkerGeoJSON.features.push(element);
      }
    });

    // Removing marker object from newGeoJSON
    if (indexes) {
      let counter = 0;
      indexes.forEach(p => {
        newGeoJSON.features.splice(p - counter, 1);
        counter++;
      });
    }

    this.map.getSource('YourMapSource').setData(newGeoJSON);
    if (geoJSON.features.length > 0) {
      this.setColorArrayData(this.map);
    }

    this.addMarkerLayerOnMap();

  }

  addMarkerLayerOnMap() {
    // Add markers to the map.
    for (const marker of this.newMarkerGeoJSON.features) {
      if (marker.styledetails.styledata.markername) {
        // Create a DOM element for each marker.
        let markerName = `../../assets/marker-icons/all_maki_icons/svgs/${marker.styledetails.styledata.markername}.svg`;
        const el = document.createElement('div');
        const width = marker.styledetails.styledata.height;
        const height = marker.styledetails.styledata.width;
        el.className = 'marker';
        el.id = marker.styledetails.id;
        el.style.backgroundImage = `url(${markerName})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.cursor = 'pointer';

        el.addEventListener('click', () => {
          this.sendIdentityFeatureStatus(marker);
        });

        el.addEventListener('contextmenu', () => {
          this.sendIdentityFeatureStatus(marker);
        });

        // Add markers to the map.
        new maplibregl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map);
      }
      else if (marker.styledetails.styledata.textname) {
        let canDragtextField: boolean | void = true;
        const el = document.createElement('div');
        const width = marker.styledetails.styledata.width;
        const height = marker.styledetails.styledata.height;
        el.className = 'marker';
        el.id = marker.styledetails.id;
        // el.style.backgroundImage = `url(${markerName})`;
        el.innerHTML = `${marker.styledetails.styledata.textname}`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.cursor = 'pointer';
        el.style.color = marker.styledetails.styledata.color;
        el.style.fontSize = `${marker.styledetails.styledata.textfontsize}px`;

        // Add markers to the map.
        let customMarker = new maplibregl.Marker(el, {
          draggable: true
        })
          .setLngLat(marker.geometry.coordinates)
          .addTo(this.map);

        customMarker.on('dragend', (e) => {
          if (canDragtextField) {
            let resultGeoJSON = { ...this.geo_json_main };
            const lngLat = e.target.getLngLat();
            let index = resultGeoJSON.features.findIndex(m => el.id == m.id);
            resultGeoJSON.features[index].geometry.coordinates = [lngLat['lng'], lngLat['lat']];
            this.setDataOnMap(this.map, resultGeoJSON);
            this.dataShareService.sendSourceData(resultGeoJSON);
          }
        })

        el.addEventListener('contextmenu', () => {
          canDragtextField = this.openTextFieldPopUp(marker, canDragtextField);
        });

        el.addEventListener('click', () => {
          if (this.canDeleteMarker) {
            this.deleteFeature(marker);
          }
          else {
            canDragtextField = this.openTextFieldPopUp(marker, canDragtextField);
          }
        })

      }
    }
  }

  openTextFieldPopUp(marker: any, canDragtextField: boolean | void) {
    const dialogRef = this.matDialog.open(TextEditComponent, {
      data: { textField: marker, geo_json_main: this.geo_json_main, map: this.map },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      let resultGeoJSON = { ...this.geo_json_main };
      if (result) {
        let index = resultGeoJSON.features.findIndex(m => result.id == m.id);
        resultGeoJSON.features[index].geometry.coordinates = [result.textLng, result.textLat];
        resultGeoJSON.features[index].styledetails.styledata.color = result.textColor;
        resultGeoJSON.features[index].styledetails.styledata.height = result.textHeight;
        resultGeoJSON.features[index].styledetails.styledata.width = result.textWidth;
        resultGeoJSON.features[index].styledetails.styledata.textname = result.textName;
        resultGeoJSON.features[index].styledetails.styledata.textfontsize = result.textFontSize;
      }
      canDragtextField = false;
      this.setDataOnMap(this.map, resultGeoJSON);
      this.dataShareService.sendSourceData(resultGeoJSON);
      return canDragtextField;
    });
    // this.sendIdentityFeatureStatus(marker);
    // this.sendIdentityFeatureStatus(marker);
  }

  setTextFieldData(data: any) {

  }

  deleteAllMarkers() {
    if (this.newMarkerGeoJSON.features.length > 0) {
      this.newMarkerGeoJSON.features.forEach(element => {
        document.getElementById(`${element.styledetails.id}`).remove();
      });
      this.newMarkerGeoJSON = {
        type: 'FeatureCollection',
        features: [],
      };
    }
  }

  sendIdentityFeatureStatus(e: any) {
    if (this.canDeleteMarker) {
      this.deleteFeature(e);
    }
    else {
      this.showIdentityFeature(
        this.identityFeatureData(e.properties)
      );
    }
    // this.activeFeatureId = e.properties.featureid;
  }

  deleteFeature(e: any) {
    let temp_geo_json = { ...this.geo_json_main };
    let index = temp_geo_json.features.findIndex(m => m.id == e.properties.featureid);
    temp_geo_json.features.splice(index, 1);
    this.setDataOnMap(this.map, temp_geo_json);
    this.dataShareService.sendSourceData(temp_geo_json);
  }

  identityFeatureData(properties: any) {
    let objKeys: any = Object.keys(properties);
    let newArrayOfObj: any[] = [];
    objKeys.forEach((element) => {
      let newObj = { name: '', value: '' };
      newObj.name = element;
      newObj.value = properties[element];
      newArrayOfObj.push(newObj);
    });
    return newArrayOfObj;
  }

  showIdentityFeature(data: any) {
    setTimeout(() => {
      this.identityFeatureService.sendShowIdentityFeatureStatus(false);
      setTimeout(() => {
        this.identityFeatureService.sendShowIdentityFeatureStatus(true);
        this.identityFeatureService.sendIdentityFeatureData(data);
      }, 200);
    }, 0);
  }

  // For undo and redo we are useing array index

  dataState = [];
  currentStateIndex = 0;
  isUndoChecked = false;

  setDataSourceFn(data: any) {
    if (this.isUndoChecked) {
      this.dataState.length = this.currentStateIndex;
    }
    let tempData = JSON.parse(JSON.stringify({ ...data }));
    this.dataState.push(tempData);
    this.currentStateIndex++;
    this.isUndoChecked = false;
  }

  handleUndo() {
    if (this.dataState.length > 0) {
      this.currentStateIndex--;
      if (this.currentStateIndex <= 0) {
        this.snackBarService.openSnackbar(`You can't undo from this state'`, 'snackbar-err');
        this.currentStateIndex++;
      }
      else {
        let tempDataState = this.dataState[this.currentStateIndex - 1];
        this.setDataOnMap(this.map, JSON.parse(JSON.stringify({ ...tempDataState })), true, false);
        this.dataShareService.sendSourceData(JSON.parse(JSON.stringify({ ...tempDataState })));
        this.setColorArrayData(this.map);
        this.isUndoChecked = true;
      }
    }
    else {
      this.snackBarService.openSnackbar('Please draw some feature first', 'snackbar-err');
    }
  }

  handleRedo() {
    if (this.dataState.length > 0) {
      this.currentStateIndex++;
      if (this.currentStateIndex > this.dataState.length) {
        this.snackBarService.openSnackbar(`You can't redo from this state`, 'snackbar-err');
        this.currentStateIndex--;
      }
      else {
        let tempDataState = this.dataState[this.currentStateIndex - 1];
        this.setDataOnMap(this.map, JSON.parse(JSON.stringify({ ...tempDataState })), true, false);
        this.dataShareService.sendSourceData(JSON.parse(JSON.stringify({ ...tempDataState })));
        this.setColorArrayData(this.map);
        this.isUndoChecked = true
      }
    }
    else {
      this.snackBarService.openSnackbar('Please use undo first', 'snackbar-err');
    }
  }

}
