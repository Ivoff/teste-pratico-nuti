require('dotenv').config();
const express = require('express');
const app = express();
const Router = require('./router/router');

app.use(express.json());
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const router = new Router(app);
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
})