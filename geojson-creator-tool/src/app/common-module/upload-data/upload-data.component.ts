import { Component, Input, OnInit, Inject } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StyleServiceService } from 'src/app/services/style-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
      this.uploadedJsonObj = this.setGeoJsonForOurTool(JSON.parse(fileReader.result.toString()));
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

  closeDialog() {
    this.dialogRef.close();
  }

}
