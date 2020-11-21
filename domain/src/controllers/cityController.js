const Controller = require('./controller');
const City = require('../entities/plane');

class CityController extends Controller {
    constructor() {
        super(City);
    }
}

module.exports = CityController;