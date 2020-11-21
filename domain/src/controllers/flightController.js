const Controller = require('./controller');
const Flight = require('../entities/flight');

class FlightController extends Controller {
    constructor() {
        super(Flight);
    }
}

module.exports = FlightController;