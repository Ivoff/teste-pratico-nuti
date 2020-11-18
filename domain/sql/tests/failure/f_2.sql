-- o avião tem que estar na cidade de origem no dia e hora do voo
INSERT INTO flight(
    flight_plane_id,
    flight_city_origin,
    flight_city_destiny,
    flight_date,
    flight_duration
)
VALUES (
    1, 3, 2, '2020-11-17 07:30', 3
)