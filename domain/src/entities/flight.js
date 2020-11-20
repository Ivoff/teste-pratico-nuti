const {Model} = require("./model");
const con = require('../database.js');
const utils = require('../utils.js');

class Flight extends Model {
    constructor(id, plane, city_origin, city_destiny, date, duration) {
        super();
        this.id = id;
        this.plane = plane;
        this.city_origin = city_origin;
        this.city_destiny = city_destiny;
        this.date = date;
        this.duration = duration;
    }
    async checkTimeAvailability() {
        const sql = `
        SELECT flight.*
        FROM flight
        WHERE
            flight_plane = $1 AND (
                ($2 BETWEEN
                    flight_date AND (flight_date + interval '1h' * flight_duration)
                ) OR
                (($2 + interval '1h' * $3) BETWEEN 
                    flight_date AND (flight_date + interval 1h' * flight_duration)
                )
            )`;

        const {rows} = await con.query(sql, [this.id, this.date, this.duration]);
        console.log(rows);
    }

    async checkLocalityAvailability() {
        const sql = `
        SELECT flight.*
        FROM flight
        WHERE            
            $3 <> (
                SELECT aux0.flight_city_destiny
                FROM (
                    SELECT flight_city_destiny, MAX(flight_date)
                    FROM flight
                    WHERE 
                        flight_plane = $1 AND
                        flight_date < $2
                    GROUP BY flight.flight_city_destiny
                ) aux0
                LIMIT 1
            ) OR
            $4 <> (
                SELECT aux1.flight_city_origin
                FROM (
                    SELECT flight_city_origin, MIN(flight_date)
                    FROM flight
                    WHERE 
                        flight_plane = $1 AND
                        flight_date > $2 + interval '1h' * $5
                    GROUP BY flight.flight_city_origin
                ) aux1
                LIMIT 1
            )`;

        const { rows } = await con.query(sql, [
            this.id, 
            this.date, 
            this.city_origin, 
            this.city_destiny, 
            this.duration
        ]);
        console.log(rows);
    }    

    save() {
        this.checkLocalityAvailability();
        this.checkTimeAvailability();
        return;
        super.save(Flight, this);
    }

    delete() {super.delete(Flight, this);}

    read() {super.read(Flight, this);}
}

module.exports = { Flight };