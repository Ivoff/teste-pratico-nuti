const {Model} = require("./model");

class Plane extends Model {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    save() {return super.save(Plane, this);}

    delete() {return super.delete(Plane, this);}

    async read() {return super.read(Plane, this);}

    all() {return super.all(Plane, this)}
}

module.exports = { Plane };