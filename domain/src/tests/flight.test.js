require('dotenv').config();
const Flight = require('../entities/flight');
const con = require('../database');

afterAll( async () => {    
    await con.end();
});

describe('Failures', () => {
    test('testa conflito do horario com outro voo', async () => {
        let flight = new Flight({
            id: null,
            plane: 1,
            city_origin: 4,
            city_destiny: 1,
            date: '2020-10-31 23:00',
            duration: 9
        });
        const result = await flight.save();
        expect(result).toEqual({
            status: false,
            errorCode: 'time_conflict',
            data: {
                time_conflicts: [
                    {
                        id: 1,
                        plane: 1,
                        city_origin: 1,
                        city_destiny: 2,
                        date: '2020-11-01 05:00',
                        duration: 4
                    }
                ],
                locality_conflicts: []
            }
        })
    });
});