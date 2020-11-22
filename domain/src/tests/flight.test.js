require('dotenv').config({ path: '../.env' });
process.env.DB_DATABASE = 'test';

const Flight = require('../entities/flight');
const con = require('../database/database');

afterAll( async () => {    
    await con.end();
});

describe('Conflito Horário', () => {
    test('Testa o conflito do horário mais a duração do novo voo com os outros e retorno o primeiro voo que gerou conflito', async () => {
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
                    new Flight({
                        id: 1,
                        plane: 1,
                        city_origin: 1,
                        city_destiny: 2,
                        date: '2020-11-01 05:00:00',
                        duration: 4
                    })
                ]                
            }
        })
    });

});

describe('Conflito de Localidade', () => {
    test('Testa conflito da cidade de origem do próximo voo não ser a mesma cidade de destino do voo sendo cadastrado', async () => {
        let flight = new Flight({
            id: null,
            plane: 1,
            city_origin: 4,
            city_destiny: 2,
            date: '2020-10-31 23:00',
            duration: 5
        });

        const result = await flight.save();
        expect(result).toEqual({
            status: false,
            errorCode: 'locality_conflicts',
            data: {
                locality_conflicts: {
                    previous_flight: [],
                    next_flight: [
                        new Flight({
                            id: 1,
                            plane: 1,
                            city_origin: 1,
                            city_destiny: 2,
                            date: '2020-11-01 05:00:00',
                            duration: 4
                        })
                    ]                    
                }
            }
        })

        let flight2 = new Flight({
            id: null,
            plane: 1,
            city_origin: 3,
            city_destiny: 4,
            date: '2020-11-01 19:00',
            duration: 6
        });
        const result2 = await flight2.save();
        expect(result2).toEqual({
            status: false,
            errorCode: 'locality_conflicts',
            data: {
                locality_conflicts: {
                    previous_flight:[],
                    next_flight:[
                        new Flight({
                            id: 3,
                            plane: 1,
                            city_origin: 3,
                            city_destiny: 1,
                            date: '2020-11-02 13:00:00',
                            duration: 6
                        })
                    ]
                }
            }
        })
    });

    test('Testa conflito da cidade de destino do voo anterior não ser a mesma cidade de origem do voo sendo cadastrado', async () => {
        let flight = new Flight({
            id: null,
            plane: 1,
            city_origin: 1,
            city_destiny: 3,
            date: '2020-11-01 19:00',
            duration: 6
        });
        const result = await flight.save();
        expect(result).toEqual({
            status: false,
            errorCode: 'locality_conflicts',
            data: {
                locality_conflicts: {
                    previous_flight:[
                        new Flight({
                            id: 2,
                            plane: 1,
                            city_origin: 2,
                            city_destiny: 3,
                            date: '2020-11-01 10:00:00',
                            duration: 2
                        })
                    ],
                    next_flight:[]
                }
            }
        })
    });

    test('Testa conflito de tanto a cidade de origem quanto a de destino serem diferente das entre dois voos', async () => {
        let flight = new Flight({
            id: null,
            plane: 1,
            city_origin: 1,
            city_destiny: 4,
            date: '2020-11-01 19:00',
            duration: 6
        });
        const result = await flight.save();
        expect(result).toEqual({
            status: false,
            errorCode: 'locality_conflicts',
            data: {
                locality_conflicts: {
                    previous_flight:[
                        new Flight({
                            id: 2,
                            plane: 1,
                            city_origin: 2,
                            city_destiny: 3,
                            date: '2020-11-01 10:00:00',
                            duration: 2
                        })
                    ],
                    next_flight:[
                        new Flight({
                            id: 3,
                            plane: 1,
                            city_origin: 3,
                            city_destiny: 1,
                            date: '2020-11-02 13:00:00',
                            duration: 6
                        })
                    ]
                }
            }
        })
    });
});    