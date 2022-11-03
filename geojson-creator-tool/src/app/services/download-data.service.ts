import { Injectable } from '@angular/core';
import tokml from 'geojson-to-kml';

@Injectable({
  providedIn: 'root'
})
export class DownloadDataService {

  constructor() { }

  downloadData(downloadType: string, data: any) {
    const copyOfGeoJSON = JSON.parse(JSON.stringify(data));
    switch (downloadType) {
      case 'geojson':
        this.downloadObjectAsJson(copyOfGeoJSON, 'map_geojson');
        break;
      case 'kml':
        this.downloadObjectAsKml(copyOfGeoJSON, 'map_kml');
        break;
      default:
        break;
    }
  }

  downloadObjectAsKml(exportObj: any, exportName) {
    const kml = tokml(exportObj);
    const kmlNameDescription = tokml(exportObj, {
      name: exportName,
      description: "description"
    });
    const kmlDocumentName = tokml(exportObj, {
      documentName: "My List Of Markers",
      documentDescription: "One of the many places you are not I am"
    });

    var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(kmlDocumentName);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".kml");
    downloadAnchorNode.innerText = exportName;
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  downloadObjectAsJson(exportObj: any, exportName: string) {
    var dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.innerText = exportName;
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  changeTypeMarkerToPoint(tempData: any) {
    tempData.features.forEach((element, index) => {
      if (element.geometry.type == 'marker') {
        tempData.features[index].geometry.type = 'Point';
      }
    });
    return tempData;
  }

}
