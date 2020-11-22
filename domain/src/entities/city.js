const Model = require("./model");

class City extends Model {
    id      = null;
    name    = null;
    
    constructor(data) {
        super();
        Object.assign(this, data);
    }

    async save() {return super.save(City, this);}

    async delete() {return super.delete(City, this);}

    async read() {return super.read(City, this);}

    static async all(obj) {return super.all(City, obj);}
}

module.exports = City;