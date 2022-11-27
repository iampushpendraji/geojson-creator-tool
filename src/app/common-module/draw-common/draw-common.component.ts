import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatSlideToggle, MatSlideToggleChange } from "@angular/material/slide-toggle";
import * as maplibregl from "maplibre-gl";
import * as turf from "@turf/turf";
import { DataShareService } from "src/app/services/data-share.service";
import { IdentityFeatureServiceService } from "src/app/services/identity-feature-service.service";
import { MapServiceService } from "src/app/services/map-service.service";
import { SnackbarService } from "src/app/services/snackbar.service";
import { StyleServiceService } from "src/app/services/style-service.service";
import { MatDialog } from "@angular/material/dialog";
import { UploadDataComponent } from "../upload-data/upload-data.component";
import { DownloadDataService } from "src/app/services/download-data.service";

@Component({
  selector: "app-draw-common",
  templateUrl: "./draw-common.component.html",
  styleUrls: ["./draw-common.component.css"],
})
export class DrawCommonComponent implements OnInit, AfterViewInit {
  // isMarker: boolean = true;
  circlePolygonFeature: any;
  editModeGeoJsonCheck: number = 0;
  canDeleteGeom: boolean = false;
  drawText: boolean;
  drawCustomMarker: boolean;
  layerEditMode: boolean = false;
  geo_json_main: any = {
    type: "FeatureCollection",
    features: [],
  };
  activeTool: string = "simple-select";
  activeDrawMode: string;
  canDrawMarker: boolean = false;
  drawContinuously: boolean = false;
  showMapCursorTip: boolean = false;
  mousePopUpMessage: string = `Welcome to Your Map<br><sub>Please select any drawing type and enjoy !!</sub>`;
  marker: any;
  activeFeatureId: string;
  @Input() draw: any;
  @Input() map: any;
  @Output() sendIdentityFeatureData: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('mouseTip') mouseTip: MatSlideToggle;

  constructor(
    private styleService: StyleServiceService,
    private dataShareService: DataShareService,
    private identityFeatureService: IdentityFeatureServiceService,
    private snackbarService: SnackbarService,
    private mapService: MapServiceService,
    private matDialog: MatDialog,
    private downloadDataService: DownloadDataService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.drawDefinations();
    this.dataShareService.initializeMapPopUp();
    this.dataShareService.getSourceData.subscribe((data) => {
      this.geo_json_main = data;
    });
    this.mapService.getCircleFeature.subscribe((data) => {
      this.circlePolygonFeature = data;
    });

    this.map.on("click", (e: any) => {
      if (this.canDrawMarker) {
        this.getCoordinates(e);
      }
    });
    // this.draw.add()
    // setTimeout(() => {
    //   this.mouseTip.checked = true;
    //   this.mousePopupTurnOn();
    // }, 0);
  }

  drawDefinations() {
    this.map.on("draw.create", () => this.getDrawSource("create"));
    this.map.on("draw.delete", () => this.getDrawSource("delete"));
    this.map.on("draw.update", () => this.getDrawSource("update"));
    this.setIdentityFeature();
  }

  setIdentityFeature() {
    this.map.on("click", "YourMapSourceIdLineString", (e: any) => {
      this.geomClickHandler(e);
    });
    this.map.on("click", "YourMapSourceIdPolygon", (e: any) => {
      this.geomClickHandler(e);
    });
    this.map.on("click", "YourMapSourceIdPoint", (e: any) => {
      this.geomClickHandler(e);
    });
    this.setMouseEffectOnMap();
  }

  geomClickHandler(e: any) {
    if (this.canDeleteGeom) {
      this.deleteFeatureOnClick(e);
    } else {
      if (this.activeTool == "simple-select") {
        this.sendIdentityFeatureStatus(e);
      }
    }
  }

  deleteFeatureOnClick(e: any) {
    let temp_geo_json = { ...this.geo_json_main };
    const activeFeatureId = e.features[0].properties.featureid;
    let index = temp_geo_json.features.findIndex(
      (m) => m.id == activeFeatureId
    );
    temp_geo_json.features.splice(index, 1);
    this.styleService.setDataOnMap(this.map, temp_geo_json);
    this.dataShareService.sendSourceData(temp_geo_json);
  }

  setMouseEffectOnMap() {
    // Change the cursor to a pointer when the mouse is over the states layer.
    this.map.on("mouseenter", "YourMapSourceIdLineString", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseenter", "YourMapSourceIdPolygon", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseenter", "YourMapSourceIdPoint", () => {
      this.map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    this.map.on("mouseleave", "YourMapSourceIdLineString", () => {
      this.map.getCanvas().style.cursor = "";
    });
    this.map.on("mouseleave", "YourMapSourceIdPolygon", () => {
      this.map.getCanvas().style.cursor = "";
    });
    this.map.on("mouseleave", "YourMapSourceIdPoint", () => {
      this.map.getCanvas().style.cursor = "";
    });
  }

  // Converting object to array of object
  identityFeatureData(properties: any) {
    let objKeys: any = Object.keys(properties);
    let newArrayOfObj: any[] = [];
    objKeys.forEach((element) => {
      let newObj = { name: "", value: "" };
      newObj.name = element;
      newObj.value = properties[element];
      newArrayOfObj.push(newObj);
    });
    return newArrayOfObj;
  }

  sendIdentityFeatureStatus(e: any) {
    this.showIdentityFeature(
      this.identityFeatureData(e.features[0].properties)
    );
    this.activeFeatureId = e.features[0].properties.featureid;
  }

  showIdentityFeature(data: any) {
    setTimeout(() => {
      this.identityFeatureService.sendShowIdentityFeatureStatus(false);
      setTimeout(() => {
        this.identityFeatureService.sendShowIdentityFeatureStatus(true);
        // Added output because event emmiter was triggering more than once
        this.sendIdentityFeatureData.emit(data);
        // this.identityFeatureService.sendIdentityFeatureData(data);
      }, 200);
    }, 0);
  }

  getDrawSource(type: string) {
    if (type == "create") {
      this.setGeoJsonMain();
      // this.map.getSource('YourMapSource').setData(this.geo_json_main);
      this.styleService.setDataOnMap(this.map, this.geo_json_main);
      if (!this.drawContinuously) {
        this.mousePopUpMessage = `Welcome to Your Map<br><sub>Please select any drawing type and enjoy !!</sub>`;
      }
    }
    if (type == "update") {
      if (this.layerEditMode) {
        this.editModeGeoJsonCheck++;
      }
    }
    this.sendDrawSourceData();
    if (this.drawContinuously || this.canDeleteGeom) {
      if (type !== "create") {
        return;
      }
      setTimeout(() => {
        this.draw.changeMode(this.activeDrawMode);
      }, 0);
    } else {
      setTimeout(() => {
        this.afterDrawCreated();
      }, 0);
    }
    if (this.showMapCursorTip) {
      this.mousePopupTurnOn();
    }
  }

  setGeoJsonMain() {
    let drawData = this.draw.getAll();
    let featureData;
    if (this.activeDrawMode == "draw_radius") {
      featureData = this.circlePolygonFeature;
      featureData.id = this.draw.getAll().features[0].id;
      this.circlePolygonFeature = undefined;
    } else {
      featureData = drawData.features[0];
    }
    if (featureData) {
      featureData.properties["featureid"] = drawData.features[0].id;
      featureData = this.setStyleDetails(featureData);
      this.geo_json_main.features.push(featureData);
      this.geo_json_main.features = this.getUniqueValue();
      this.draw.deleteAll();
    }
  }

  setStyleDetails(data: any) {
    let featureStyleData: any = data,
      polygonObj: any = {
        fillcolor: "#ed811c",
        fillopacity: 0.4,
        fillborderwidth: 2,
        fillbordercolor: "#3b1513",
      },
      lineObj = {
        linecolor: "#572d06",
        linewidth: 2,
      },
      pointObj = {
        circleradius: 6,
        circlecolor: "#B42222",
      },
      markerObj = {
        height: "20",
        width: "20",
        markername: "marker",
      },
      textObj = {
        height: "20",
        width: "fit-content",
        color: "blue",
        textfontsize: "15",
        textname: "Edit Text",
      };

    if (data.geometry.type == "Polygon") {
      const area = turf.area(data);
      featureStyleData.styledetails = {
        id: data.id,
        styledata: polygonObj,
      };
      featureStyleData.measurement = {
        squaremeters: Math.round(area * 100) / 100,
      };
    }

    if (data.geometry.type == "Point") {
      if (!this.drawCustomMarker) {
        featureStyleData.styledetails = {
          id: data.id,
          styledata: pointObj,
        };
      } else {
        if (this.drawText) {
          featureStyleData.styledetails = {
            id: data.id,
            styledata: textObj,
          };
        } else {
          featureStyleData.styledetails = {
            id: data.id,
            styledata: markerObj,
          };
        }
        featureStyleData.geometry.type = "marker";
      }
    }

    if (data.geometry.type == "LineString") {
      const distance = turf.length(this.draw.getAll());
      featureStyleData.styledetails = {
        id: data.id,
        styledata: lineObj,
      };
      featureStyleData.measurement = {
        kilometers: distance,
      };
    }

    return featureStyleData;
  }

  getUniqueValue() {
    var newObjArr = this.geo_json_main.features.reduce(function (
      previous,
      current
    ) {
      var alredyExists =
        previous.filter(function (item) {
          return item.id === current.id;
        }).length > 0;
      if (!alredyExists) {
        previous.push(current);
      }
      return previous;
    },
      []);

    return newObjArr;
  }

  afterDrawCreated() {
    if (this.layerEditMode) {
      this.activeTool = "edit-mode";
    } else {
      this.activeTool = "simple-select";
    }
    // this.isMarker = false;
    // if (this.showMapCursorTip) {
    //   this.dataShareService.removeMapPopUp();
    // }
  }

  getCoordinates(e: any) {
    let coordObject = e.lngLat.wrap();
    let coord: [number, number] = [coordObject.lng, coordObject.lat];
    this.drawMarker(coord);
  }

  drawMarker(coord: [number, number]) {
    this.marker = new maplibregl.Marker({
      draggable: true,
    })
      .setLngLat(coord)
      .addTo(this.map);
    if (!this.drawContinuously) {
      this.handleMarker("deactive");
      this.activeTool = "simple-select";
    }
  }

  startDraw(type: string) {
    this.identityFeatureService.sendShowIdentityFeatureStatus(false);
    if (!this.layerEditMode) {
      this.activeTool = type;
      if (this.activeTool !== "marker") {
        this.handleMarker("deactive");
      }
      if (this.activeTool !== "custom-marker" || "add-text") {
        this.drawCustomMarker = false;
      }
      if (type !== "delete-tool") {
        this.canDeleteGeom = false;
        this.styleService.canDeleteMarker = false;
      }
      switch (type) {
        case "polygon":
          this.activeDrawMode = "draw_polygon";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage = "Use mouse left click to drop polygon vertices on map and for stop use mouse double click";
          break;
        case "circle":
          this.activeDrawMode = "draw_radius";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Use mouse left click one time then drag mouse for set radius and use mouse left click to stop";
          break;
        case "line":
          this.activeDrawMode = "draw_line_string";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage = "Use mouse left click to drop line vertices and for stop use mouse double click";
          break;
        case "freehand":
          this.activeDrawMode = "draw_freehand";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Hold mouse left click and drag mouse to draw freehand polygon like pencil sketch";
          break;
        case "points":
          this.activeDrawMode = "draw_point";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage = "Use mouse left click to ploat point";
          break;
        case "marker":
          this.activeDrawMode = "active";
          this.handleMarker(this.activeDrawMode);
          this.mousePopUpMessage = "Use mouse left click and draw marker";
          break;
        case "square":
          this.activeDrawMode = "draw_rectangle";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Press mouse left click one time to start drawing freehand Square and for stop only use mouse left click once";
          break;
        case "freehand-line":
          this.activeDrawMode = "draw_freehand_line";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Hold mouse left click and draw on map like pencil skectch";
          break;
        case "custom-marker":
          this.drawCustomMarker = true;
          this.drawText = false;
          this.activeDrawMode = "draw_point";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Press mouse left click and add marker on map";
          break;
        case "add-text":
          this.drawCustomMarker = true;
          this.drawText = true;
          this.activeDrawMode = "draw_point";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage = "Press mouse left click to add text on map";
          break;
        case "simple-select":
          this.activeDrawMode = "simple_select";
          this.draw.changeMode(this.activeDrawMode);
          this.mousePopUpMessage =
            "Welcome to Your Map<br><sub>Please select any drawing type and enjoy !!</sub>";
          break;
        case "delete-tool":
          this.draw.changeMode("simple_select");
          this.canDeleteGeom = true;
          this.styleService.canDeleteMarker = true;
          this.mousePopUpMessage = "Click on feature which you want to delte";
          break;
        default:
          break;
      }
      if (this.showMapCursorTip) {
        this.dataShareService.useMapPopUp(
          this.map,
          this.mousePopUpMessage,
          "color: gray; font-family: fantasy;"
        );
      }
    } else {
      let message = !this.isRotateModeActive ? "Please turn of edit layer to use this feature" : "Please turn off layer rotate mode to use this feature";
      this.snackbarService.openSnackbar(
        message,
        "snackbar-err"
      );
    }
  }

  isRotateModeActive: boolean = false;
  rotateModeHandler() {
    this.editModeHandler();
    setTimeout(() => {
      this.draw.changeMode('rotate_mode');
    }, 0);
    this.isRotateModeActive = !this.isRotateModeActive;
  }

  editModeHandler() {
    this.layerEditMode = !this.layerEditMode;
    if (this.layerEditMode) {
      this.activeTool = "edit-mode";
      this.mousePopUpMessage = "Click on feature to edit or drag it on map";
      if (this.showMapCursorTip) {
        this.dataShareService.useMapPopUp(
          this.map,
          this.mousePopUpMessage,
          "color: gray; font-family: fantasy;"
        );
      }
      this.draw.changeMode("simple_select");
      // this.isMarker = false;
      let tempGeoJSON = this.downloadDataService.changeTypeMarkerToPoint(
        JSON.parse(JSON.stringify({ ...this.geo_json_main }))
      );
      this.styleService.deleteAllMarkers();
      this.draw.add(tempGeoJSON);
      this.map.getSource("YourMapSource").setData({
        type: "FeatureCollection",
        features: [],
      });
    } else {
      this.activeTool = "simple-select";
      this.geo_json_main = this.setGeoJsonForStopEditMode();
      // this.map.getSource('YourMapSource').setData(this.geo_json_main);
      if (this.editModeGeoJsonCheck > 0 || this.isRotateModeActive) {
        this.styleService.setDataOnMap(this.map, this.geo_json_main, false);
      } else {
        this.styleService.setDataOnMap(
          this.map,
          this.geo_json_main,
          false,
          false
        );
      }
      this.dataShareService.sendSourceData(this.geo_json_main);
      this.draw.deleteAll();
      this.stopDraw();
      this.editModeGeoJsonCheck = 0;
    }
  }

  // Change type marker to point for edit layer mode
  // This is temp
  changeTypeMarkerToPoint(tempData: any) {
    tempData.features.forEach((element, index) => {
      if (element.geometry.type == "marker") {
        tempData.features[index].geometry.type = "Point";
      }
    });
    return tempData;
  }

  setGeoJsonForStopEditMode() {
    let updated_draw_data = this.draw.getAll();
    this.geo_json_main.features.forEach(
      (geo_json_main_element, geo_json_main_index) => {
        updated_draw_data.features.forEach(
          (updated_draw_data_element, updated_draw_data_index) => {
            if (updated_draw_data_element.id == geo_json_main_element.id) {
              this.geo_json_main.features[
                geo_json_main_index
              ].geometry.coordinates =
                updated_draw_data.features[
                  updated_draw_data_index
                ].geometry.coordinates;
            }
          }
        );
      }
    );
    return this.geo_json_main;
  }

  stopDraw() {
    this.activeTool = "simple-select";
    if (this.showMapCursorTip) {
      this.mousePopUpMessage = `Welcome to Your Map<br><sub>Please select any drawing type and enjoy !!</sub>`;
      this.dataShareService.useMapPopUp(
        this.map,
        this.mousePopUpMessage,
        "color: gray; font-family: fantasy;"
      );
    }
    // this.draw.trash();
    this.draw.changeMode("simple_select");
    // this.isMarker = false;
    this.handleMarker("deactive");
    this.canDeleteGeom = false;
    this.styleService.canDeleteMarker = false;
  }

  handleMarker(type: string) {
    if (type == "active") {
      this.draw.trash();
      this.canDrawMarker = true;
    } else {
      this.canDrawMarker = false;
    }
  }

  getDrawContinousStatus(event: MatSlideToggleChange) {
    this.drawContinuously = event.checked;
    if (this.drawContinuously == false) {
      this.stopDraw();
    }
  }

  getShowTipOnMouseStatus(event: MatSlideToggleChange) {
    if (event.checked) {
      this.mousePopupTurnOn();
    } else {
      this.mousePopupTurnOff();
    }
  }

  mousePopupTurnOn() {
    this.showMapCursorTip = true;
    this.dataShareService.useMapPopUp(
      this.map,
      this.mousePopUpMessage,
      "color: gray; font-family: fantasy;"
    );
  }

  mousePopupTurnOff() {
    this.showMapCursorTip = false;
    this.dataShareService.removeMapPopUp();
  }

  sendDrawSourceData() {
    this.dataShareService.sendSourceData(this.geo_json_main);
  }

  showDataTable() {
    this.dataShareService.sendShowDataTableStatus(true);
    this.stopDraw();
  }

  addLabelHandler(event: any) {
    if (event.checked == true) {
      let tempGeoJSON1 = this.downloadDataService.changeTypeMarkerToPoint(
        JSON.parse(JSON.stringify({ ...this.geo_json_main }))
      );
      let tempGeoJSON = this.changeTypePolygonToPoint(
        JSON.parse(JSON.stringify({ ...tempGeoJSON1 }))
      );
      this.mapService.addLabelFn(tempGeoJSON);
      console.log(this.geo_json_main);
    } else {
      this.mapService.removeLabelFn();
    }
  }

  changeTypePolygonToPoint(data: any) {
    let tempData = { ...data };
    tempData.features.forEach((element, index) => {
      if (element.geometry.type == "Polygon") {
        let centerPoint = turf.centroid(element);
        tempData.features[index].geometry = centerPoint.geometry;
      }
    });
    return tempData;
  }

  undo() {
    if (!this.layerEditMode) {
      this.styleService.handleUndo();
    } else {
      this.snackbarService.openSnackbar(
        "Please turn of edit layer to use undo",
        "snackbar-err"
      );
    }
  }

  redo() {
    if (!this.layerEditMode) {
      this.styleService.handleRedo();
    } else {
      this.snackbarService.openSnackbar(
        "Please turn of edit layer to use redo",
        "snackbar-err"
      );
    }
  }

  showUploadDialog() {
    const dialogRef = this.matDialog.open(UploadDataComponent, {
      width: "250px",
      data: { map: this.map },
      enterAnimationDuration: "200ms",
      exitAnimationDuration: "200ms",
    });
  }

  downloadData() {
    let dataSource = JSON.parse(JSON.stringify({ ...this.geo_json_main }));
    this.downloadDataFinal(dataSource, "geojson");
  }

  downloadDataFinal(dataSource: any, downloadType: string) {
    if (dataSource) {
      if (dataSource.features.length > 0) {
        dataSource = this.downloadDataService.changeTypeMarkerToPoint(
          JSON.parse(JSON.stringify({ ...dataSource }))
        );
        this.downloadDataService.downloadData(downloadType, { ...dataSource });
      } else {
        this.snackbarService.openSnackbar(
          "Please draw atleast one geometry",
          "snackbar-err"
        );
      }
    } else {
      this.snackbarService.openSnackbar(
        "Please draw atleast one geometry",
        "snackbar-err"
      );
    }
  }

  resetData() {
    this.draw.deleteAll();
    this.stopDraw();
    this.geo_json_main = {
      type: "FeatureCollection",
      features: [],
    };
    this.dataShareService.sendSourceData(this.geo_json_main);
    this.mapService.removeLayerFn();
    this.mapService.removeSourceFn();
    this.styleService.deleteAllMarkers();
    this.mapService.addSourceFn();
    this.layerEditMode = false;
    this.isRotateModeActive = false;
    // this.styleService.setDataOnMap(this.map, this.geo_json_main);
    // this.map.getSource('YourMapSource').setData(this.geo_json_main);
  }
}
