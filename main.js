import './style.css';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

///SHOW MAP
var map = new Map({
    target: 'map',
    layers: [
        new Tile({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([4.8552, 45.7774]),
        zoom: 6
    })
});