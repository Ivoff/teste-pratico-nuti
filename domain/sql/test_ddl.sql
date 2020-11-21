CREATE DATABASE test;

\connect test

CREATE TABLE IF NOT EXISTS plane (
    plane_id SERIAL PRIMARY KEY,
    plane_name VARCHAR(180)
);

CREATE TABLE IF NOT EXISTS city (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(180)
);

CREATE TABLE IF NOT EXISTS flight (
    flight_id SERIAL PRIMARY KEY,
    flight_plane integer REFERENCES plane(plane_id),
    flight_city_origin integer REFERENCES city(city_id),
    flight_city_destiny integer REFERENCES city(city_id),
    flight_date TIMESTAMP WITHOUT TIME ZONE,
    flight_duration integer CHECK (flight_duration > 0) 
);

INSERT INTO plane (plane_name)
VALUES 
    ('plane1'),
    ('plane2'),
    ('plane3'),
    ('plane4');

INSERT INTO city (city_name)
VALUES
    ('city1'),
    ('city2'),
    ('city3'),
    ('city4');

INSERT INTO flight(    
    flight_plane,
    flight_city_origin,
    flight_city_destiny,
    flight_date,
    flight_duration
) VALUES
    (1, 1, 2, '2020-11-01 05:00', 4),
    (1, 2, 3, '2020-11-01 10:00', 2),
    (1, 3, 1, '2020-11-02 13:00', 6),

    (2, 1, 4, '2020-11-01 14:00', 12),
    (2, 4, 2, '2020-11-03 10:00', 6),
    (2, 2, 3, '2020-11-01 18:00', 4);