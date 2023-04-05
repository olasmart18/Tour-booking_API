const express = require('express');

const route = express.Router();
const { allTour } = require('../controllers/toursControllers');

route.get('/api/tours', allTour);

module.exports = route;
