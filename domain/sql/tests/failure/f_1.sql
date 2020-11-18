-- não deve haver outro voo agendado para o mesmo avião durante a execução do novo voo
INSERT INTO flight(
    flight_plane_id,
    flight_city_origin,
    flight_city_destiny,
    flight_date,
    flight_duration
) VALUES (
    1, 3, 2, '2020-11-16 15:00', 6
)