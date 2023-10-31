const express = require("express");

const route = express.Router();
const {
  allTour,
  createTour,
  getSingleTour,
  deleteSingleTour,
  deleteTours,
  updateTour,
  searchTour,
  BookTour,
  getBookedTour,
} = require("../controllers/toursControllers");

// ensure route protection 
const isUser = require ("../utils/verify")

route.post("/tour/book/:tourId", isUser, BookTour);
route.get("/tour", getBookedTour);
route.get("/tours", allTour);
route.get("/tours/:id", getSingleTour);
route.post("/tour", createTour);
route.delete("/tour/:tourId", deleteSingleTour);
route.delete("/tours", deleteTours);
route.patch("/tours/:id", updateTour);
route.get("/tours/search/searchTour", searchTour);

module.exports = route;
