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
                    flight_date AND (flight_date + interval '1h' * flight_duration)
                )
            )`;
        try {            
            const result = await con.query(sql, [this.plane.id, this.date, this.duration]);
            return result;
        } catch(err) {
            console.trace(err);
            return;
        }    
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
        try {
            const result = await con.query(sql, [
                this.plane.id, 
                this.date, 
                this.city_origin.id, 
                this.city_destiny.id, 
                this.duration
            ]);
            return result;
        } catch(err) {
            console.trace(err);
            return;
        }
    }    

    async save() {
        const timeConflicts = await this.checkTimeAvailability();
        const localityConflicts = await this.checkLocalityAvailability();
        
        if (timeConflicts.rowCount || localityConflicts.rowCount) {
            console.log('voo invalido');
            return {
                time_conflicts: timeConflicts.rows,
                locality_conflicts: localityConflicts.rows
            };
        }

        return super.save(Flight, this);
    }

    delete() {return super.delete(Flight, this);}

    async read() {return super.read(Flight, this);}

    all() {return super.all(Flight, this);}
}

module.exports = { Flight };