DROP TABLE IF EXISTS flight CASCADE;
DROP TABLE IF EXISTS plane;
DROP TABLE IF EXISTS city;
DROP TRIGGER IF EXISTS trigger_insert_flight;

CREATE TABLE plane (
    plane_id SERIAL PRIMARY KEY,
    plane_name VARCHAR(180)
);
CREATE TABLE city (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(180)
);
CREATE TABLE flight (
    flight_id SERIAL PRIMARY KEY,
    flight_plane_id integer REFERENCES plane(plane_id),
    flight_city_origin integer REFERENCES city(city_id),
    flight_city_destiny integer REFERENCES city(city_id),
    flight_date TIMESTAMP WITHOUT TIME ZONE,
    flight_duration integer CHECK (flight_duration > 0) 
);

CREATE OR REPLACE FUNCTION insert_flight() RETURNS TRIGGER AS 
$insert_flight$
    DECLARE
        not_ok RECORD;
    BEGIN
        EXECUTE '
            SELECT * 
            FROM flight
            WHERE 
                flight_plane_id = NEW.plane_id AND
                (NEW.flight_date BETWEEN flight.flight_date AND flight.flight_date + (interval $2 * flight.flight_duration)) OR
                (NEW.flight_date + interval $2 * NEW.flight_duration BETWEEN flight.flight_date AND flight.flight_date + (interval $2 * flight.flight_duration)) OR
                NEW.flight_city_origin <> (
                    SELECT flight_city_destiny 
                    FROM (
                        SELECT flight_city_destiny, MAX(flight_date)
                        FROM flight
                        WHERE flight_date < $1
                    )
                    LIMIT 1
                ) OR
                NEW.flight_city_destiny <> (
                    SELECT flight_city_origin 
                    FROM (
                        SELECT flight_city_origin, MIN(flight_date)
                        FROM flight
                        WHERE flight_date > $1
                    )
                    LIMIT 1
                )
        ' INTO not_ok USING NEW.flight_date, '1h';

        IF FOUND THEN
            RETURN NULL;
        ELSE
            RETURN NEW;
        END IF;
        -- SELECT * INTO not_ok
        -- FROM 
        --     flight 
        -- WHERE 
        --     (NEW.flight_date BETWEEN flight.flight_date AND flight.flight_date + (interval '1h' * flight.flight_duration)) AND
        --     NEW.flight_city_origin IN (
        --         SELECT flight_city_destiny 
        --         WHERE flight_city_destiny < 
        --     )
    END;
$insert_flight$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_insert_flight BEFORE INSERT ON flight
EXECUTE FUNCTION insert_flight();