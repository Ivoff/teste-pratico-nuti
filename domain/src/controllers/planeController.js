const Plane = require('../entities/plane');
const Controller = require('./controller');

class PlaneController extends Controller {
    constructor() {
        super(Plane);
    }
}

module.exports = PlaneController;