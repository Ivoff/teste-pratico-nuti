const Model = require("./model");
const con = require('../database/database.js');
const utils = require('../misc/utils');
const { Exception } = require('../exceptions/exceptions');
const Plane = require("./plane");
const City = require('./city');

class Flight extends Model {
    id              = null;
    plane           = null;
    city_origin     = null;
    city_destiny    = null;
    date            = null;
    duration        = null;

    constructor(data) {
        super();
        Object.assign(this, data);
        this.plane = new Plane(this.plane);
        this.city_origin = new City(this.city_origin);
        this.city_destiny = new City(this.city_destiny);        
    }

    async timeConflicts() {        
        const sql = `
        SELECT flight.*
        FROM flight
        WHERE
            flight_plane = $1 AND (
                ($2::timestamp BETWEEN
                    flight_date AND (flight_date + interval '1h' * flight_duration)
                ) OR
                (($2::timestamp + interval '1h' * $3) BETWEEN 
                    flight_date AND (flight_date + interval '1h' * flight_duration)
                )
            )`;
        try {            
            const result = await con.query(sql, [
                this.plane.id ?? this.plane, 
                this.date, 
                this.duration
            ]);            
            return {
                rowCount: result.rowCount,
                data: utils.rowsToArrayOfObjects(Flight, result.rows)
            }
        } catch(err) {
            console.trace(err);
            throw err;
        }    
    }

    async localityConflicts() {
        
        const sqlPreviousFlightConflict = `
        SELECT *
        FROM 
            flight 
            INNER JOIN (
                SELECT             
                    flight.flight_id AS id,       
                    flight.flight_city_destiny AS city_destiny,
                    flight.flight_date AS date
                FROM flight
                WHERE
                    flight_plane = $1 AND
                    flight_date < $2::timestamp 
                GROUP BY
                    flight.flight_id,        
                    flight.flight_city_destiny, 
                    flight.flight_date
                ORDER BY flight_date DESC
                LIMIT 1
            ) AS next_flight
            ON (flight.flight_id = next_flight.id AND $3 <> next_flight.city_destiny)                    
        LIMIT 1`;

        const sqlNextFlightConflict = `
        SELECT *
        FROM 
            flight 
            INNER JOIN (
                SELECT             
                    flight.flight_id AS id,       
                    flight.flight_city_origin AS city_origin,
                    flight.flight_date AS date
                FROM flight
                WHERE
                    flight_plane = $1 AND
                    flight_date > $2::timestamp + interval '1h' * $4 
                GROUP BY
                    flight.flight_id,        
                    flight.flight_city_origin, 
                    flight.flight_date
                ORDER BY flight_date ASC
                LIMIT 1
            ) AS next_flight
            ON (flight.flight_id = next_flight.id AND $3 <> next_flight.city_origin)                    
        LIMIT 1`;      
                
        try {
            
            const resultBefore = await con.query(sqlPreviousFlightConflict, [
                this.plane.id ?? this.plane,
                this.date,
                this.city_origin.id ?? this.city_origin,
            ]);

            const resultAfter = await con.query(sqlNextFlightConflict, [
                this.plane.id ?? this.plane,
                this.date,
                this.city_destiny.id ?? this.city_destiny,
                this.duration
            ]);
            
            return {
                rowCount: resultAfter.rowCount + resultBefore.rowCount,
                data: {                    
                    previous_flight: utils.rowsToArrayOfObjects(Flight, resultBefore.rows),
                    next_flight: utils.rowsToArrayOfObjects(Flight, resultAfter.rows),
                }
            };

        } catch(err) {
            console.trace(err);
            throw err;
        }        
    }

    async save() {            
        if (this.id === undefined || this.id === null) {
            try {                                                
                const timeConflicts = await this.timeConflicts();                
                if (timeConflicts.rowCount) {                                
                    return {
                        status: false,
                        errorCode: 'time_conflict',
                        data: { time_conflicts: timeConflicts.data }                
                    };

                } else {
                    const localityConflicts = await this.localityConflicts();                    
                    if (localityConflicts.rowCount) {                        
                        return {
                            status: false,
                            errorCode: 'locality_conflict',
                            data: { locality_conflicts: localityConflicts.data }                
                        };

                    } else {                                                
                        return super.save(Flight, this);
                    }
                }
            } catch(err) {
                throw err;
            }
        } else {
            try {
                return super.save(Flight, this);
            } catch (err) {
                throw err;
            }
        }
    }

    async delete() {return super.delete(Flight, this);}

    async read() {return super.read(Flight, this);}

    async all(obj) {return super.all(Flight, obj);}
}

module.exports = Flight;