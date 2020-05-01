import {Component, OnInit} from '@angular/core';
import {Place} from './types/place';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  position: google.maps.LatLng;
  places: Place[] = [];

  file: any;

  ngOnInit(): void {
    this.position = new google.maps.LatLng(44.793753, 20.3827883);
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    console.log(this.file);
    this.parseDocument(this.file);
  }

  parseDocument(file) {
    const fileReader = new FileReader();
    fileReader.onload = async (e: any) => {
      const result = await this.extractGoogleCoords(e.target.result);

      console.log(result);

    };
    fileReader.readAsText(file);
  }

  async extractGoogleCoords(plainText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(plainText, 'text/xml');

    if (xmlDoc.documentElement.nodeName === 'kml') {

      for (const folder of xmlDoc.getElementsByTagName('Folder') as any) {
        if (folder.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim().includes('Nonsmoking bars&restaurants')) {
          for (const item of folder.getElementsByTagName('Placemark') as any) {
            const placeMarkName = item.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim();
            const markers = item.getElementsByTagName('Point');

            for (const marker of markers) {
              const coords = marker.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim();
              const coord = coords.split(',');
              const point = {lat: +coord[1], lng: +coord[0]};
              this.places.push(new Place(placeMarkName, new google.maps.LatLng(point.lat, point.lng)));
            }
          }
        }
      }
    } else {
      throw new Error('error while parsing');
    }

    return this.places;

  }
}
