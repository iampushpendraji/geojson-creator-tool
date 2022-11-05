import { Component, Input, OnInit, Inject } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StyleServiceService } from 'src/app/services/style-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css']
})
export class UploadDataComponent implements OnInit {
  uploadedFile: any;
  uploadedJsonObj: any;
  map: any;

  constructor(private dialogRef: MatDialogRef<UploadDataComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private styleService: StyleServiceService, private dataShareService: DataShareService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    if (this.data) {
      this.map = this.data.map;
    }
  }

  uploadFile(event: any) {
    this.uploadedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.uploadedFile, "UTF-8");
    fileReader.onload = () => {
      // Here we are adding markers and text fields
      let uploadedFile = this.setStyleOnUploadedFile(fileReader.result.toString());
      this.uploadedJsonObj = this.setGeoJsonForOurTool(uploadedFile);
      this.dataShareService.sendSourceData(this.uploadedJsonObj);
      this.styleService.setDataOnMap(this.map, this.uploadedJsonObj
      );
      this.snackbarService.openSnackbar('File uploaded successfully', 'snackbar-success');
      this.dialogRef.close();
    }
    fileReader.onerror = (error) => {
      console.log(error);
      this.snackbarService.openSnackbar('Failed in uploading your flile please try again', 'snackbar-err');
    }
  }

  setGeoJsonForOurTool(geo_json_main: any) {
    if (geo_json_main.features.length > 0) {
      geo_json_main.features.forEach((element: any, index: any) => {
        if (element.geometry.type == 'Point') {
          if (element.styledetails.styledata.markername !== undefined) {
            geo_json_main.features[index].geometry.type = "marker";
          }
          else if (element.styledetails.styledata.textname !== undefined) {
            geo_json_main.features[index].geometry.type = "marker";
          }
          else {
            geo_json_main.features[index].geometry.type = "Point";
          }
        }
      });
    }
    return geo_json_main;
  }

  setStyleOnUploadedFile(data: any) {
    let counter = 0,
      data1 = JSON.parse(data),
      temp_geo_json = JSON.parse(JSON.stringify({ ...data1 })),
      final_temp_geo_json = JSON.parse(JSON.stringify({ ...temp_geo_json }));
    temp_geo_json.features.forEach((element, index) => {
      if (element.styledetails == undefined) {
        if (element.id == undefined) {
          final_temp_geo_json.features[index].id = 'new_feature' + Number(Math.random() + counter);
          final_temp_geo_json.features[index].properties = { featureid: final_temp_geo_json.features[index].id };
          final_temp_geo_json.features[index].styledetails = { id: final_temp_geo_json.features[index].id };
          final_temp_geo_json.features[index] = this.setStyleDetailsInFeature(final_temp_geo_json, index);
          counter++;
        }
        else {
          final_temp_geo_json.features[index].properties = { featureid: final_temp_geo_json.features[index].id };
          final_temp_geo_json.features[index].styledetails = { id: final_temp_geo_json.features[index].id };
          final_temp_geo_json.features[index] = this.setStyleDetailsInFeature(final_temp_geo_json, index);
        }
      }
    });
    return final_temp_geo_json;
  }

  setStyleDetailsInFeature(element: any, index) {
    let temp_element = JSON.parse(JSON.stringify({ ...element }));
    switch (temp_element.features[index].geometry.type) {
      case 'Polygon':
        temp_element.features[index].styledetails = {
          id: temp_element.features[index].id,
          styledata: {
            fillcolor: "#ed811c",
            fillopacity: 0.4,
            fillborderwidth: 2,
            fillbordercolor: "#3b1513"
          }
        }
        temp_element.features[index].measurement = {
          squaremeters: Math.round(turf.area(temp_element) * 100) / 100
        }
        break;
      case 'Point':
        temp_element.features[index].styledetails = {
          id: temp_element.features[index].id,
          styledata: {
            circleradius: 6,
            circlecolor: "#B42222"
          }
        }
        break;
      case 'LineString':
        temp_element.features[index].styledetails = {
          id: temp_element.features[index].id,
          styledata: {
            linecolor: "#572d06",
            linewidth: 2
          }
        }
        temp_element.features[index].measurement = {
          kilometers: turf.length(temp_element)
        }
        break;
    }
    return temp_element.features[index];
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
