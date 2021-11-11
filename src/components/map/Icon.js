import L from 'leaflet';

const iconTruck = new L.Icon({
    iconUrl: require('../../assets/images/car.png'),
    iconRetinaUrl: require('../../assets/images/car.png'),
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [32,32],
    html: `<img 
    style="transform: rotate(80deg);"`
});

export { iconTruck };