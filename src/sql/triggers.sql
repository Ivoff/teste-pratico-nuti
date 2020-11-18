DROP TRIGGER IF EXISTS trigger_insert_flight ON flight;

CREATE OR REPLACE FUNCTION insert_flight() RETURNS TRIGGER AS
$insert_flight$
DECLARE
    -- conflict flight%ROWTYPE;
    conflict REFCURSOR;
    conflict_count INTEGER;
    current_conflict RECORD;
    current_error_id INTEGER;
BEGIN
    OPEN conflict FOR 
    EXECUTE '
        SELECT flight.*     
        FROM flight
        WHERE 
            flight_plane_id = $1 AND (
                ($2 BETWEEN 
                    flight_date AND (flight_date + interval '||quote_literal('1h')||' * flight_duration)
                ) OR
                (($2 + interval '||quote_literal('1h')||' * $3) BETWEEN 
                    flight_date AND (flight_date + interval '||quote_literal('1h')||' * flight_duration)
                ) OR
                $4 <> (
                    SELECT aux.flight_city_destiny
                    FROM (
                        SELECT flight_city_destiny, MAX(flight_date)
                        FROM flight
                        WHERE 
                            flight_plane_id = $1 AND
                            flight_date < $2
                        GROUP BY flight.flight_city_destiny
                    ) aux
                    LIMIT 1
                ) OR
                $5 <> (
                    SELECT aux.flight_city_origin
                    FROM (
                        SELECT flight_city_origin, MIN(flight_date)
                        FROM flight
                        WHERE 
                            flight_plane_id = $1 AND
                            flight_date > $2
                        GROUP BY flight.flight_city_origin
                    ) aux
                    LIMIT 1
                )
            )' USING 
                NEW.flight_plane_id,
                NEW.flight_date,
                NEW.flight_duration,
                NEW.flight_city_origin,
                NEW.flight_city_destiny;
    
    FETCH conflict INTO current_conflict;    

    IF current_conflict.flight_id IS NULL THEN
        RAISE EXCEPTION 'voo invalido';
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'passou';
        
        current_error_id := nextval('error_attempt_sequence');
        INSERT INTO flight_error(flight_error_attempt, flight_error_flight)
        VALUES(current_error_id, current_conflict.flight_id);

        LOOP
            FETCH conflict INTO current_conflict;
            
            IF NOT FOUND THEN 
                EXIT; 
            END IF;

            current_error_id := nextval('error_attempt_sequence');

            INSERT INTO flight_error(flight_error_attempt, flight_error_flight)
            VALUES(current_error_id, current_conflict.flight_id);
        END LOOP;
    END IF;
END;
$insert_flight$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_insert_flight BEFORE INSERT ON flight
FOR EACH ROW EXECUTE FUNCTION insert_flight();