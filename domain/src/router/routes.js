const PlaneController = require('../controllers/planeController');
const CityController = require('../controllers/cityController');
const FlightController = require('../controllers/flightController');

const routes = [
    {'plane':   PlaneController},
    {'city':    CityController},
    {'flight':  FlightController},
];

module.exports = routes;