const express = require('express');

const route = express.Router();
const {
	allTour,
	createTour,
	getSingleTour,
	deleteSingleTour,
	deleteTours,
	updateTour,
	updateBookedTour,
	searchTour,
	BookTour,
	getBookedTour,
} = require('../controllers/toursControllers');

// Ensure route protection
const {isUser} = require('../utils/verify');
const {isAdmin} = require('../utils/verify');

route.post('/tour/book/:tourId', isUser, BookTour);
route.get('/tour', isAdmin, getBookedTour);
route.get('/tours', allTour);
route.get('/tours/:tourId', getSingleTour);
route.post('/tour', isAdmin, createTour);
route.delete('/tour/:tourId', isAdmin, deleteSingleTour);
route.delete('/tours', isAdmin, deleteTours);
route.patch('/tours/:tourId', isAdmin, updateTour);
route.put('/tours/:tourId', isUser, updateBookedTour);
route.get('/tours/search/searchTour', searchTour);

module.exports = route;
