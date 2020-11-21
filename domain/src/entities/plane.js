const Model = require("./model");

class Plane extends Model {
    id      = null;
    name    = null;
    
    constructor(data) {
        super();
        Object.assign(this, data);
    }

    save() {return super.save(Plane, this);}

    delete() {return super.delete(Plane, this);}

    async read() {return super.read(Plane, this);}

    all() {return super.all(Plane, this)}
}

module.exports = Plane;