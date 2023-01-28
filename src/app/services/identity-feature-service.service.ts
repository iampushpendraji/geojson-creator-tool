import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdentityFeatureServiceService {
  showIdentityFeatureStatus: EventEmitter<any> = new EventEmitter<any>();
  getIdentityFeatureData: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  sendShowIdentityFeatureStatus(status: boolean) {
    this.showIdentityFeatureStatus.emit(status);
  }

  sendIdentityFeatureData(data: any) {
    this.getIdentityFeatureData.emit(data);
  }
  
}
