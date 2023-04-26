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
const verifyUser = require('../util/verify').verifyUser;
const verifyAdmin = require('../util/verify').verifyAdmin;

route.get('/tours', verifyAdmin, verifyUser, allTour);
route.get('/tours/:id', verifyUser, verifyAdmin, getSingleTour);
route.post('/tours', verifyAdmin, createTour);
route.delete('/tours/:id', verifyAdmin, deleteSingleTour);
route.delete('/tours', verifyAdmin, deleteTours);
route.patch('/tours/:id', verifyAdmin, updateTour);
route.get('/tours/search/searchTour', verifyAdmin, verifyUser, searchTour);

module.exports = route;
