const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const connect = require('./config/db');
const tourRoute = require('./route/tourRoutes');
const UserRouter = require('./route/usersRoute');
const authRouter = require('./route/auth');
const initializePassport = require ("./utils/passport");

// initialize passport function to passport
initializePassport(passport)

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    cookie: {
        maxAge: 24 * 7 * 60 * 60 * 1000,
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 7 * 60 * 60 
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// custom routes
app.use('/api', tourRoute);
app.use('/api', UserRouter);
app.use('/api/auth', authRouter);

connect(); // mongoDB connection 
app.listen(port, () => console.log(`server running on port ${port}`));
