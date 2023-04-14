const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connect = require('./config/db');
const route = require('./route/tourRoutes');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', route);

connect();
app.listen(port, () => console.log(`server running on port ${port}`));
