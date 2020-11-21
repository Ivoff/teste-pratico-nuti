const Controller = require('./controller');
const City = require('../entities/city');

class CityController extends Controller {
    constructor() {
        super(City);
    }
}

module.exports = CityController;