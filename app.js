require('dotenv').config();
const express = require('express');
const ejs = require("ejs");
const cors  = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connect = require('./config/db');
const tourRoute = require('./route/tourRoutes');
const UserRouter = require('./route/usersRoute');
const authRouter = require('./route/auth');
const localPassport = require ("./utils/passport").localPassport;
const googlePassport = require ("./utils/passport").googlePassport;
const logRoute  = require('./utils/verify').logRoute;

// initialize passport function to passport
localPassport(passport)
googlePassport(passport)

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    cookie: {
        maxAge: 24 * 7 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 7 * 60 * 60 // auto clear session fron database
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // create passport session

// custom routes
app.use('/api', tourRoute);
app.use('/api', UserRouter);
app.use('/', authRouter);

// log every route accessed
app.use(logRoute);

connect(); // mongoDB connection 
app.listen(port, () => {
    if (process.env.NODE_ENV === "development") {
        console.log(`server running on port ${port}`)
    } else {
        console.log("production")
    }
    
});
