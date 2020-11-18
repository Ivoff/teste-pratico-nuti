-- a cidade de destino não pode ser diferente da cidade do próximo voo desse avião
INSERT INTO flight (
flight_plane_id,
flight_city_origin,
flight_city_destiny,
flight_date,
flight_duration
)
VALUES(
1, 1, 3, '2020-11-17 15:00', 6)