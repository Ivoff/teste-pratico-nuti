const Model = require("./model");

class City extends Model {
    id      = null;
    name    = null;
    
    constructor(data) {
        super();
        Object.assign(this, data);
    }

    save() {return super.save(City, this);}

    delete() {return super.delete(City, this);}

    async read() {return super.read(City, this);}

    all() {return super.all(City, this);}
}

module.exports = City;