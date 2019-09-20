import {computeDestinationPoint} from 'geolib';
import LngLat from './LngLat';
export default class RangeRing {
  constructor(lngLat, distance, name = '') {
    this.center = lngLat;
    this.distance = distance;
    this.name = `${name} - ${distance / 1000}km`;
    this.points = this.calculatePoints();

  }
  calculatePoints() {
    const bearings = Array.from(Array(37)).map((item, i) => 360 / 36 * i);
    const points = bearings.map(bearing => computeDestinationPoint(
      { latitude: this.center.lat, longitude: this.center.lng },
      this.distance,
      bearing
    ));
    return points.map(point => new LngLat([point.longitude, point.latitude]));
  }
  getLabelPosition() {
    return this.points[0];
  }
  getLabelText() {
    return this.name;
  }
  getGeoJSON() {
    return {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': this.points.map(point => [point.lng, point.lat])
        }
      },
    };
  }
  getLayer() {
    return {
      'type': 'line',
      'source': this.getGeoJSON(),
      'layout': {},
      'paint': {
        'line-color': 'rgb(209, 79, 79)',
        'line-width': 2,
        'line-opacity': 0.8
      }
    }
  }
}
