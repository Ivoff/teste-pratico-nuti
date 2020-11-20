const {Model} = require("./model");

class Plane extends Model {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    save() {return super.save(Plane, this);}

    delete() {super.delete(Plane, this);}

    read() {super.read(Plane, this);}
}

module.exports = {Plane};