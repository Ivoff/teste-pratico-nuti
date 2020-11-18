-- DROP TABLE IF EXISTS flight CASCADE;
-- DROP TABLE IF EXISTS plane;
-- DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS flight_error;
DROP SEQUENCE IF EXISTS error_attempt_sequence;

-- CREATE TABLE plane (
--     plane_id SERIAL PRIMARY KEY,
--     plane_name VARCHAR(180)
-- );

-- CREATE TABLE city (
--     city_id SERIAL PRIMARY KEY,
--     city_name VARCHAR(180)
-- );

-- CREATE TABLE flight (
--     flight_id SERIAL PRIMARY KEY,
--     flight_plane_id integer REFERENCES plane(plane_id),
--     flight_city_origin integer REFERENCES city(city_id),
--     flight_city_destiny integer REFERENCES city(city_id),
--     flight_date TIMESTAMP WITHOUT TIME ZONE,
--     flight_duration integer CHECK (flight_duration > 0) 
-- );

CREATE SEQUENCE error_attempt_sequence AS integer;

CREATE TABLE flight_error (
    flight_error_id SERIAL PRIMARY KEY,
    flight_error_attempt integer NOT NULL,
    flight_error_flight integer REFERENCES flight(flight_id)
)