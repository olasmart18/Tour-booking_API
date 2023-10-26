const express = require('express');

const route = express.Router();
const {
  allTour,
  createTour,
  getSingleTour,
  deleteSingleTour,
  deleteTours,
  updateTour,
  searchTour
} = require('../controllers/toursControllers');

route.get('/tours', allTour);
route.get('/tours/:id', getSingleTour);
route.post('/tours', createTour);
route.delete('/tours/:id', deleteSingleTour);
route.delete('/tours',  deleteTours);
route.patch('/tours/:id',  updateTour);
route.get('/tours/search/searchTour', searchTour);

module.exports = route;
