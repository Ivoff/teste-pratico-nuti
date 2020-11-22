const Model = require("./model");

class Plane extends Model {
    id      = null;
    name    = null;
    
    constructor(data) {
        super();
        Object.assign(this, data);
    }

    async save() {return super.save(Plane, this);}

    async delete() {return super.delete(Plane, this);}

    async read() {return super.read(Plane, this);}

    async all(obj) {
        return super.all(Plane, obj);        
    }
}

module.exports = Plane;