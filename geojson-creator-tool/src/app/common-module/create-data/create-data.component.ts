import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.css']
})
export class CreateDataComponent implements OnInit {
  @Input() map: any;
  @Input() draw: any;
  @Output() sendIdentityFeatureData: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  sendIdentityFeatureDataFn(data: any){
    this.sendIdentityFeatureData.emit(data);
  }

}
