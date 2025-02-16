import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-icon-list-dialog',
  templateUrl: './icon-list-dialog.component.html',
  styleUrls: ['./icon-list-dialog.component.css']
})
export class IconListDialogComponent implements OnInit {

  markerList: string[] = [
    'aerialway',
    			'landmark',
'airfield',		'landuse',
'airport'			,'laundry',
'alcohol-shop'	,'library',
'american-football'		,'lighthouse-JP',
'amusement-park'		,'lighthouse',
'aquarium'			,'lodging',
'arrow'			,'logging',
'art-gallery'			,'marker-stroked',
'attraction'		,'marker',
'bakery'			,'mobile-phone',
'bank-JP'			,'monument-JP',
'bank'			,'monument',
'bar'				,'mountain',
'barrier'			,'museum',
'baseball'			,'music',
'basketball'			,'natural',
'bbq'				,'observation-tower',
'beach'			,'optician',
'beer'			,'paint',
'bicycle-share'		,'park-alt1',
'bicycle'			,'park',
'blood-bank'			,'parking-garage',
'bowling-alley'		,'parking',
'bridge'			,'pharmacy',
'building-alt1'		,'picnic-site',
'building'			,'pitch',
'bus'				,'place-of-worship',
'cafe'			,'playground',
'campsite'			,'police-JP',
'car-rental'			,'police',
'car-repair'			,'post-JP',
'car'				,'post',
'casino'			,'prison',
'castle-JP'			,'racetrack-boat',
'castle'			,'racetrack-cycling',
'caution'			,'racetrack-horse',
'cemetery-JP'			,'racetrack',
'cemetery'			,'rail-light',
'charging-station'		,'rail-metro',
'cinema'			,'rail',
'circle-stroked'		,'ranger-station',
'circle'			,'recycling',
'city'		,'religious-buddhist',
'clothing-store'		,'religious-christian',
'college-JP'			,'religious-jewish',
'college'			,'religious-muslim',
'commercial'			,'religious-shinto',
'communications-tower'	,'residential-community',
'confectionery'		,'restaurant-bbq',
'construction'	,'restaurant-noodle',
'convenience'			,'restaurant-pizza',
'cricket'			,'restaurant-seafood',
'cross'			,'restaurant-sushi',
'dam'				,'restaurant',
'danger'			,'road-accident',
'defibrillator'		,'roadblock',
'dentist'			,'rocket',
'diamond'			,'school-JP',
'doctor'			,'school',
'dog-park'		,'scooter',
'drinking-water'	,'shelter',
'elevator'			,'shoe',
'embassy'			,'shop',
'emergency-phone'		,'skateboard',
'entrance-alt1'		,'skiing',
'entrance'			,'slaughterhouse',
'farm'			,'slipway',
'fast-food'			,'snowmobile',
'fence'			,'soccer',
'ferry-JP'		,'square-stroked',
'ferry'			,'square',
'fire-station-JP'		,'stadium',
'fire-station'		,'star-stroked',
'fitness-centre'		,'star',
'florist'			,'suitcase',
'fuel'			,'swimming',
'furniture'			,'table-tennis',
'gaming'			,'teahouse',
'garden-centre'		,'telephone',
'garden'			,'tennis',
'gift'			,'theatre',
'globe'		,'toilet',
'golf'			,'town-hall',
'grocery'			,'town',
'hairdresser'			,'triangle-stroked',
'harbor'			,'triangle',
'hardware'			,'veterinary',
'heart'			,'viewpoint',
'heliport'			,'village',
'highway-rest-area'		,'volcano',
'home'			,'volleyball',
'horse-riding'		,'warehouse',
'hospital-JP'			,'waste-basket',
'hospital'			,'watch',
'hot-spring'		,'	water',
'ice-cream'			,'waterfall',
'industry'			,'watermill',
'information'			,'wetland',
'jewelry-store'		,'wheelchair',
'karaoke'			,'windmill',
'landmark-JP'			,'zoo',
  ]

  activeMarker: string;

  constructor(private dialogRef: MatDialogRef<IconListDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data) {
      this.activeMarker = this.data.markerName;
    }
  }

  sendMarkerName(iconName: string){
    this.dialogRef.close(iconName);
  }

}
