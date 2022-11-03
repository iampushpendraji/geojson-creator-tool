import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataShareService } from 'src/app/services/data-share.service';
import { IdentityFeatureServiceService } from 'src/app/services/identity-feature-service.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StyleServiceService } from 'src/app/services/style-service.service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { IconListDialogComponent } from '../icon-list-dialog/icon-list-dialog.component';

@Component({
  selector: 'app-identity-feature-side-nav',
  templateUrl: './identity-feature-side-nav.component.html',
  styleUrls: ['./identity-feature-side-nav.component.css'],
})
export class IdentityFeatureSideNavComponent implements OnInit {
  showMeasurement: boolean;
  featureFormData: any;
  featureForm: FormGroup;
  showIdentityFeature: boolean;
  geo_json_main: any;
  CurrentFeatureindex: any;
  @Input() map: any;

  polygonMeasurement: number | undefined;
  lineMeasurement: number | undefined;

  markerWidth
  markerHeight
  markerName

  fillColor
  fillBorderColor
  fillBorderWidth
  fillOpacity

  lineColor
  lineWidth

  circleRadius
  circleColor

  constructor(
    private identityFeatureService: IdentityFeatureServiceService,
    private dataShareService: DataShareService,
    private _fb: FormBuilder,
    private matDialog: MatDialog,
    private styleService: StyleServiceService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.identityFeatureService.showIdentityFeatureStatus.subscribe((data) => {
      if (!data) {
        this.closeIdentity();
      }
      this.showIdentityFeature = data;
    });
    this.identityFeatureService.getIdentityFeatureData.subscribe((data) => {
      this.featureFormData = data;
      this.setFeatureFormData();
      this.findFeatureIndex();
      this.setStyleDetails()
    });
    this.dataShareService.getSourceData.subscribe((data) => {
      this.geo_json_main = data;
    });
    this.initializeFormArray();
  }

  setStyleDetails() {
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'marker') {
      this.markerName = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.markername;
      this.markerHeight = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.height;
      this.markerWidth = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.width;
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'Polygon') {
      this.fillColor = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillcolor;
      this.fillBorderColor = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillbordercolor;
      this.fillBorderWidth = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillborderwidth;
      this.fillOpacity = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillopacity;
      this.polygonMeasurement = this.geo_json_main.features[this.CurrentFeatureindex].measurement.squaremeters;
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'LineString') {
      this.lineColor = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.linecolor;
      this.lineWidth = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.linewidth;
      this.lineMeasurement = this.geo_json_main.features[this.CurrentFeatureindex].measurement.kilometers;
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'Point') {
      this.circleColor = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.circlecolor;
      this.circleRadius = this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.circleradius;
    }
  }

  saveStyleDetailsInJson() {
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'marker') {
      this.setMarkerStyleDetails();
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'Polygon') {
      this.setPolygonStyleDetails();
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'LineString') {
      this.setLineStringStyleDetails();
    }
    if (this.geo_json_main.features[this.CurrentFeatureindex].geometry.type == 'Point') {
      this.setPointStyleDetails();
    }
  }

  setMarkerStyleDetails() {
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.markername = this.markerName;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.height = this.markerHeight;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.width = this.markerWidth;
    this.dataShareService.sendSourceData(this.geo_json_main);
  }

  setPolygonStyleDetails() {
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillcolor = this.fillColor;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillbordercolor = this.fillBorderColor;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillborderwidth = this.fillBorderWidth;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.fillopacity = this.fillOpacity;
    this.dataShareService.sendSourceData(this.geo_json_main);
  }

  setLineStringStyleDetails() {
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.linecolor = this.lineColor;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.linewidth = this.lineWidth;
  }

  setPointStyleDetails() {
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.circlecolor = this.circleColor;
    this.geo_json_main.features[this.CurrentFeatureindex].styledetails.styledata.circleradius = this.circleRadius;
  }

  findFeatureIndex() {
    this.CurrentFeatureindex = this.geo_json_main.features.findIndex(m => this.featureFormData[0].value == m.id);
  }

  initializeFormArray() {
    this.featureForm = this._fb.group({
      identityFormData: this._fb.array([this.putFormData()]),
    });
  }

  putFormData() {
    return this._fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  get identityFormData() {
    return this.featureForm.get('identityFormData') as FormArray;
  }

  addNewAttribute() {
    this.identityFormData.push(this.putFormData());
  }

  removeAttribute(i: number) {
    this.identityFormData.removeAt(i);
  }

  setFeatureFormData() {
    let feature_form_data_length = this.featureFormData.length;
    for (let i = 1; i < feature_form_data_length; i++) {
      this.addNewAttribute();
    }
    // while (feature_form_data_length - 1 > 1) {
    //   this.addNewAttribute();
    //   feature_form_data_length--;
    // }
    let indexOfFeatureid = this.featureFormData.findIndex(
      (m) => m.name == 'featureid'
    );
    if (indexOfFeatureid !== 0) {
      let element = this.featureFormData.splice(indexOfFeatureid, 1)[0];
      this.featureFormData.splice(0, 0, element);
    }
    this.identityFormData.patchValue(this.featureFormData);
  }

  submitData() {
    if (this.featureForm.status == 'VALID') {
      this.setDataIn_geo_json_main(
        this.featureForm.get('identityFormData').value
      );
      // this.styleService.setDataOnMap(this.map, this.geo_json_main);
      // this.map.getSource('YourMapSource').setData(this.geo_json_main);
      this.closeIdentity();
      this.saveStyleDetailsInJson();
      // this.styleService.setColorArrayData(this.map);
      this.styleService.setDataOnMap(this.map, this.geo_json_main);
    }
    else {
      this.snackbarService.openSnackbar('Please fill all the fields or remove empty fields', 'snackbar-err');
    }
  }

  setDataIn_geo_json_main(data: any) {
    let featureData = this.setFormDataForProperties(data);
    this.setNew_geo_json_main_data(featureData);
    this.dataShareService.sendSourceData(this.geo_json_main);
  }

  setNew_geo_json_main_data(data: any) {
    let indexOfFeature = this.geo_json_main.features.findIndex(
      (p) => p.id == data.featureid
    );
    this.geo_json_main.features[indexOfFeature].properties = data;
  }

  // Array of object to object
  setFormDataForProperties(data: any) {
    let newObj: any = {};
    data.forEach((element) => {
      newObj[element.name] = element.value;
    });
    return newObj;
  }

  deleteFeature() {
    const dialogRef = this.matDialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: { messageData: 'Are You Sure You Want To Delete This Feature' },
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let featureId = this.featureFormData[0].value;
        this.deleteFeatureFromGeojson(featureId);
        this.closeIdentity();
      }
    });
  }

  deleteFeatureFromGeojson(id: string) {
    let features = this.geo_json_main.features;
    features.splice(this.CurrentFeatureindex, 1);
    this.geo_json_main.features = features;
    // this.map.getSource('YourMapSource').setData(this.geo_json_main);
    this.styleService.setDataOnMap(this.map, this.geo_json_main);
    this.dataShareService.sendSourceData(this.geo_json_main);
  }

  showMarkerList() {
    const dialogRef = this.matDialog.open(IconListDialogComponent, {
      width: '500px',
      data: { markerName: this.markerName },
      // enterAnimationDuration: '200ms',
      // exitAnimationDuration: '200ms'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.markerName = result;
      }
    });
  }

  getShowMeasurementStatus(event: any) {
    this.showMeasurement = event.checked;
  }

  showIdentity(data: any) {
    this.featureFormData = data;
    this.setFeatureFormData();
    this.findFeatureIndex();
    this.setStyleDetails()
  }

  closeIdentity() {
    this.showIdentityFeature = false;
    this.featureForm.reset();
    this.identityFormData.controls = [this.putFormData()];
  }

}
