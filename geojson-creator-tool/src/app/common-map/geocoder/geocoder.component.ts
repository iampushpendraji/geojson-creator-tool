import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as maplibregl from 'maplibre-gl';
import { GeocoderServiceService } from 'src/app/services/geocoder-service.service';
import { MapServiceService } from 'src/app/services/map-service.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-geocoder',
  templateUrl: './geocoder.component.html',
  styleUrls: ['./geocoder.component.css']
})
export class GeocoderComponent implements OnInit {
  geocodeData: any;
  reverseGeocodeData: any;
  lngLatForm: NgForm;
  map: maplibregl.Map | undefined;
  showSearchDiv: boolean = false;
  marker: maplibregl.Marker;
  constructor(
    private geocoderService: GeocoderServiceService,
    private mapService: MapServiceService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.map = this.mapService.getMapData()?.map;
    this.marker = new maplibregl.Marker({
      color: '#9508c4',
      draggable: false
  })
  }

  getGeocode(value: string) {
    this.reverseGeocodeData = undefined;
    if (this.lngLatForm) {
      this.lngLatForm.resetForm()
    }
    this.geocoderService.getGeocoderData(value).subscribe((data: any) => {
      if (data) {
        if (data.features.length == 0) {
          this.snackbarService.openSnackbar('Error In Fetching Data', 'snackbar-err')
        }
        else {
          this.geocodeData = data.features
        }
      }
    },
      err => {
        console.log(err)
      });
  }

  clearGeocode() {
    this.geocodeData = undefined;
    this.reverseGeocodeData = undefined;
    this.showSearchDiv = false;
    this.marker.remove();
  }

  showDataInMap(data: any) {
    this.map?.fitBounds(data.bbox);
    this.marker.setLngLat(data.geometry.coordinates).addTo(this.map);
  }

  showCoordinateOnMap(data: any) {
    this.map.flyTo({
      center: data.geometry.coordinates,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion,
      zoom: 21
    });
    this.marker.setLngLat(data.geometry.coordinates).addTo(this.map);
  }

  getLngLat(formData: NgForm) {
    this.lngLatForm = formData
    let lngLat = formData.value;
    this.reverseGeocode(lngLat)
  }

  reverseGeocode(value: { lat: string, lng: string }) {
    this.geocodeData = undefined;
    this.geocoderService.reverseGeocodeData(value).subscribe((data: any) => {
      if (data) {
        if (data.error) {
          this.snackbarService.openSnackbar('Error In Fetching Data', 'snackbar-err')
        }
        else {
          this.reverseGeocodeData = data.features[0]
          console.log(data)
          this.showCoordinateOnMap(this.reverseGeocodeData)
        }
      }
    },
      err => {
        console.log(err)
      })
  }

}
