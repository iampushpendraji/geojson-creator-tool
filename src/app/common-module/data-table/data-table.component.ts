import { Component, OnInit } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share.service';
import { DownloadDataService } from 'src/app/services/download-data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.css'],
    standalone: false
})
export class DataTableComponent implements OnInit {
  dataSource: any = {
    type: "FeatureCollection",
    features: [],
  };;
  showDataTable: boolean;
  tableLoaded: boolean = true;
  downloadType: string = 'geojson';
  constructor(private downloadDataService: DownloadDataService, private dataShareService: DataShareService, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.dataShareService.getSourceData.subscribe(result => {
      this.tableLoaded = false;
      this.dataSource = result;
      setTimeout(() => {
        this.tableLoaded = true;
      }, 0);
    });
    this.getShowDataTableStatus()
  }

  copyToClipboard() {
    if (this.dataSource == undefined) {
      this.snackbarService.openSnackbar('Please draw atleast one geometry', 'snackbar-err');
    }
    else {
      if (this.dataSource.features.length > 0) {
        let newDataSource = this.downloadDataService.changeTypeMarkerToPoint(JSON.parse(JSON.stringify({ ...this.dataSource })));
        navigator.clipboard.writeText(JSON.stringify(newDataSource));
        this.snackbarService.openSnackbar('Copied to clipboard', 'snackbar-success');
      }
      else {
        this.snackbarService.openSnackbar('Please draw atleast one geometry', 'snackbar-err');
      }
    }
  }

  getShowDataTableStatus() {
    this.dataShareService.getDataTableStatus.subscribe(response => {
      this.showDataTable = response;
    })
  }

  downloadTypeSelect(event: any) {
    this.downloadType = event.target.value;
  }

  downloadData() {
    if (this.dataSource) {
      if (this.dataSource.features.length > 0) {
        let newDataSource = this.downloadDataService.changeTypeMarkerToPoint(JSON.parse(JSON.stringify({ ...this.dataSource })));
        this.downloadDataService.downloadData(this.downloadType, { ...newDataSource });
      }
      else {
        this.snackbarService.openSnackbar('Please draw atleast one geometry', 'snackbar-err');
      }
    }
    else {
      this.snackbarService.openSnackbar('Please draw atleast one geometry', 'snackbar-err');
    }
  }

}
