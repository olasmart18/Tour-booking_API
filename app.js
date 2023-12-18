require('dotenv').config();
require('ejs');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const {connect} = require('./src/config/db');
const tourRoute = require('./src/route/tourRoutes');
const UserRouter = require('./src/route/usersRoute');
const authRouter = require('./src/route/auth');
const {localPassport} = require('./src/utils/passport');
const {googlePassport} = require('./src/utils/passport');
const errorHandler = require('./src/middlewares/errorHandler');
const CustomError = require('./src/middlewares/error');

// Initialize passport function to passport
localPassport(passport);
googlePassport(passport);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  session({
    cookie: {
      maxAge: 24 * 7 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 7 * 60 * 60, // Auto clear session fron database
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Create passport session

// custom routes
app.use('/api', tourRoute);
app.use('/api', UserRouter);
app.use('/', authRouter);

module.exports = {app};

// Catch undefined routes
app.all('*', (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

// Error handling middleware (should be defined last)
app.use(errorHandler);
connect(); // Database connection

app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});
