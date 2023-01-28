import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataShareService } from 'src/app/services/data-share.service';
import { StyleServiceService } from 'src/app/services/style-service.service';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css']
})
export class TextEditComponent implements OnInit {
  textColor: string;
  textLat: Number;
  textLng: Number;
  textHeight: string;
  textWidth: string;
  textName: string;
  textId: string;
  textFontSize: Number;
  geo_json_main: any;
  map: any;
  constructor(private dataShareService: DataShareService, private styleService: StyleServiceService, private dialogRef: MatDialogRef<TextEditComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.textId = data.textField.id;
      this.textColor = data.textField.styledetails.styledata.color;
      this.textName = data.textField.styledetails.styledata.textname;
      this.textHeight = data.textField.styledetails.styledata.height;
      this.textWidth = data.textField.styledetails.styledata.width;
      this.textFontSize = data.textField.styledetails.styledata.textfontsize;
      this.textLat = data.textField.geometry.coordinates[1];
      this.textLng = data.textField.geometry.coordinates[0];
      this.geo_json_main = data.geo_json_main;
      this.map = data.map;
    }
  }

  submitBtn() {
    if (this.textFontSize >= 5) {
      this.dialogRef.close(
        {
          textColor: this.textColor,
          textLat: this.textLat,
          textLng: this.textLng,
          textHeight: this.textHeight,
          textWidth: this.textWidth,
          textName: this.textName,
          textFontSize: this.textFontSize,
          id: this.textId
        });
    }
  }

  deleteText() {
    let temp_geo_json = JSON.parse(JSON.stringify({ ...this.geo_json_main }));
    let index = this.geo_json_main.features.findIndex(m => m.id == this.textId);
    temp_geo_json.features.splice(index, 1);
    this.dataShareService.sendSourceData(temp_geo_json);
    this.styleService.setDataOnMap(this.map, temp_geo_json, true, false);
    this.closeBtn();
  }

  closeBtn() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
