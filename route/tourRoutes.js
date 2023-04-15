const express = require('express');

const route = express.Router();
const {
  allTour,
  createTour,
  getSingleTour,
  deleteSingleTour,
  deleteTours,
  updateTour
} = require('../controllers/toursControllers');

route.get('/api/tours', allTour);
route.get('/api/tours/:id', getSingleTour);
route.post('/api/tours', createTour);
route.delete('/api/tours/:id', deleteSingleTour);
route.delete('/api/tours', deleteTours);
route.patch('/api/tours/:id', updateTour);

module.exports = route;
