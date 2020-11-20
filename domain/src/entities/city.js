const {Model} = require("./model");

class City extends Model {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    save() {return super.save(City, this);}

    delete() {return super.delete(City, this);}

    read() {return super.read(City, this);}
}

module.exports = { City };