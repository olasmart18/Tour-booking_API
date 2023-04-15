const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connect = require('./config/db');
const tourRoute = require('./route/tourRoutes');
const UserRouter = require('./route/usersRoute');

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', tourRoute);
app.use('/', UserRouter);

connect();
app.listen(port, () => console.log(`server running on port ${port}`));
