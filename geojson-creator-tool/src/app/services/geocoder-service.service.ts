import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeocoderServiceService {
  BASE_NOMINATIM_URL: string = 'https://nominatim.openstreetmap.org';

  constructor(private http: HttpClient) { }

  getGeocoderData(value: string){
    return this.http.get<any>(`${this.BASE_NOMINATIM_URL}/search?q=${value}&format=geojson`)
  }

  reverseGeocodeData(value: {lat: string, lng:string}){
    return this.http.get<any>(`${this.BASE_NOMINATIM_URL}/reverse?format=geojson&lat=${value.lat}&lon=${value.lng}`)
  }

}
