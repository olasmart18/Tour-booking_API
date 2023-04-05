const express = require('express');
require('dotenv').config();
const connect = require('./config/db');
const route = require('./route/tourRoutes');

const port = process.env.PORT || 3030;
const app = express();
app.use('/', route);

connect();
app.listen(port, () => console.log(`server running on port ${port}`));
