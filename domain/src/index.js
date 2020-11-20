const con = require('./database.js');
const {Plane} = require('./entities/plane');
const {Flight} = require('./entities/flight');
const {City} = require('./entities/city');

async function teste() {
  let plane1 = new Plane(null, "teste1");
  const result = await plane1.save();
  console.log(result);
}
teste();
con.end();
// var express = require('express');
// var app = express();

// app.route('/plane')
//   .get(function(req, res) {
//     res.send('Get a random book');
//   })
//   .post(function(req, res) {
//     res.send('Add a book');
//   })
//   .put(function(req, res) {
//     res.send('Update the book');
//   });