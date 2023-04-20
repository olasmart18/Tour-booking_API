const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connect = require('./config/db');
const tourRoute = require('./route/tourRoutes');
const UserRouter = require('./route/usersRoute');
const authRouter = require('./route/authRoute');

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/app', tourRoute);
app.use('/app', UserRouter);
app.use('/app', authRouter);

connect();
app.listen(port, () => console.log(`server running on port ${port}`));
