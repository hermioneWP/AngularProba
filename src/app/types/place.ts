export class Place{
  name: string;
  coordinates: google.maps.LatLng;

  constructor(placeMarkName: string, point: google.maps.LatLng) {
    this.name = placeMarkName;
    this.coordinates = point;
  }

  public getName(){
    return this.name;
  }

  public getCoordinates(){
    return this.coordinates;
  }

}
