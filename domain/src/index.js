require('dotenv').config();
const express = require('express');
const app = express();
const Router = require('./router/router');

app.use(express.json());

const router = new Router(app);
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})