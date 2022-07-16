import './style.css';
import { Map, View, Feature, Overlay } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Style as sStyle, Icon as sIcon } from 'ol/style';

/**
 * Colors meaning
 * blue : Living Place
 * green : Visiter
 * red : Want to Go
 */
const locations = [
    // France
    ['Lyon', 4.8552, 45.7774, "blue"],
    ['Paris', 2.349014, 48.864716, "green"],
    ['Marseille', 5.370000, 43.296398, "green"],
    ['Avignon', 4.805528, 43.949318, "green"],
    ['Arles', 4.6278, 43.6766, "green"],
    ['Nîmes', 4.361000, 43.838001, "green"],
    ['Annecy', 6.1294, 45.8992, "green"],
    ['Aix-les-bains', 5.9090, 45.6923, "green"],
    ['Dijon', 5.0415, 47.3220, "green"],
    ['Nice', 7.2620, 43.7102, "green"],
    // Suisse
    ['Genève', 6.1432, 46.2044, "blue"],
    ['Berne', 7.4474, 46.9480, "green"],
    ['Fribourg', 7.1620, 46.8065, "green"],
    // Amérique du Nord
    ['Montréal', -73.561668, 45.508888, "blue"],
    // Amérique du Sud
    // Europe
    ['Madrid', -3.7038, 40.4168, "green"],
    ['Toled', -4.0273, 39.8628, "green"],
    ['Londres', -0.1276, 51.5072, "green"],
    ['Brighton', 0.1363, 50.8229, "green"],
    ['Wrocław', 17.0385, 51.1079, "green"],
    ['Cracovie', 19.9450, 50.0647, "green"],
    ['Dresden', 13.7373, 51.0504, "green"],
    ['Gorlitz', 14.9689, 51.1525, "green"],
    // Asie
    ['Pékin', 116.4074, 39.9042, "green"],
    ['Xi\'An', 108.9541, 34.2658, "green"],
    ['Tokyo', 139.6503, 35.6762, "red"],
    // Afrique
    ['Pyramides de Gizeh', 31.1325, 29.9773, "red"]
];

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');

const features = [];
let previousName = null;
/** 
 * Create Marker function
 * @return {feature}
 */
function createMarker(name, lonLat, color, circleFill) {
    if (!color) color = 'red';
    if (!circleFill) circleFill = 'white';
    const feature = new Feature({
        geometry: new Point(fromLonLat(lonLat)),
        name: name
    });
    const svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
        '<path fill="' + color + '" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
        '<circle fill="' + circleFill + '" cx="15" cy="10.677" r="3.291"/></svg>';

    feature.setStyle(
        new sStyle({
            image: new sIcon({
                anchor: [0.5, 1.0],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'data:image/svg+xml,' + escape(svg),
                scale: 1,
                imgSize: [30, 30],
            })
        })
    );
    return feature;
}

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new Overlay({
    element: container,
    autoPan: true,
});

// Creating features
for (let loc of locations) {
    features.push(createMarker(loc[0], [loc[1], loc[2]], loc[3]));
}

const vectorSource = new Vector({ // VectorSource
    features: features
});

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        }),
        new VectorLayer({
            source: vectorSource
        })
    ],
    overlays: [overlay],
    target: 'map',
    view: new View({
        center: fromLonLat([4.8552, 45.7774]),
        zoom: 10
    })
});

// Make the map's view to zoom and pan enough to display all the points
map.getView().fit(vectorSource.getExtent(), map.getSize());

/**
 * Add a click handler to the map to render the popup.
 */
map.on('singleclick', function(evt) {
    const name = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature.get('name');
    })
    if (name && name != previousName) {
        container.style.visibility = "visible";
        container.style.opacity = 1;
        const coordinate = evt.coordinate;
        content.innerHTML = name;
        overlay.setPosition(coordinate);
        previousName = name
    } else {
        container.style.visibility = "hidden";
        container.style.opacity = 0;
        previousName = previousName === name ? null : name
    }
});

map.on('pointermove', function(evt) {
    map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
});