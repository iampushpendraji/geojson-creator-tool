import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-create-data',
    templateUrl: './create-data.component.html',
    styleUrls: ['./create-data.component.css'],
    standalone: false
})
export class CreateDataComponent implements OnInit {
  @Input() map: any;
  @Input() draw: any;
  @Output() sendIdentityFeatureData: EventEmitter<any> = new EventEmitter<any>();
  // @Output() getShowGeocoderStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  sendIdentityFeatureDataFn(data: any){
    this.sendIdentityFeatureData.emit(data);
  }

  // sendShowGeocoderStatus(status: any) {
  //   this.getShowGeocoderStatus.emit(status);
  // }

}
