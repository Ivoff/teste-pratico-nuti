const con = require('./database.js');
const {Plane} = require('./entities/plane');
const {Flight} = require('./entities/flight');
const {City} = require('./entities/city');

async function teste() {
  let plane1 = new Plane(1, null);
  let plane2 = new Plane(2, null);
  await plane1.read();  
  await plane2.read();

  let city1 = new City(1, null);
  let city2 = new City(2, null);
  let city3 = new City(3, null);
  let city4 = new City(4, null);
  await city1.read();
  await city2.read();
  await city3.read();
  await city4.read();
  
  // let flight1 = new Flight(1, null, null, null, null, null);
  // await flight1.read();  
  let flight2 = new Flight(null, plane1, city3, city2, '2020-11-01 14:00', 4);
  await flight2.save();
  // let flight3 = new Flight(null, plane1, city3, city1, '2020-11-03 20:00', 3);
  // let flight4 = new Flight(null, plane1, city1, city3, '2020-11-04 07:00', 3);
  // let flight5 = new Flight(null, plane2, city2, city4, '2020-11-01 10:00', 1);
  // let flight6 = new Flight(null, plane2, city4, city1, '2020-11-01 17:00', 1);
  con.end();
}

teste();