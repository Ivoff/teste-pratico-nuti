const {Model} = require("./model");

class City extends Model {
    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

    save() {return super.save(City, this);}

    delete() {return super.delete(City, this);}

    async read() {
        const result = await super.read(City, this);
        return result;
    }

    all() {return super.all(City, this);}
}

module.exports = { City };