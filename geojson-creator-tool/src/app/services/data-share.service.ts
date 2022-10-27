import { EventEmitter, Injectable, Output } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  popUp: maplibregl.Popup;
  map: maplibregl.Map;
  popUpMessage: string;
  popUpStyle: string;
  getDataTableStatus: EventEmitter<any> = new EventEmitter<any>();
  getSourceData: EventEmitter<any> = new EventEmitter<any>();
  getStyleDetails: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  sendShowDataTableStatus(status: any) {
    this.getDataTableStatus.emit(status);
  }

  sendSourceData(data: any) {
    this.getSourceData.emit(data);
  }

  sendStyleDetails(data: any) {
    this.getStyleDetails.emit(data);
  }

  initializeMapPopUp() {
    this.popUp = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });
  }

  popData = (e) => {
    let latLngData: any = [e.lngLat.lng, e.lngLat.lat];
    this.popUp.setLngLat(latLngData).setHTML(`<span style='${this.popUpStyle}'>${this.popUpMessage}</span>`).addTo(this.map);
  }

  useMapPopUp(map: any, message: string, popUpStyle = '') {
    this.map = map;
    this.popUpStyle = popUpStyle;
    this.popUpMessage = message;
    map.on('mousemove', this.popData);
    map.on('mouseout', () => {
      this.popUp.remove()
    });
  }

  removeMapPopUp() {
    this.map.off('mousemove', this.popData);
    this.popUp.remove();
  }

}
