const { Schema, model } = require('mongoose');

const tourSchema = Schema({
  place: String,
  destination: String,
  bookDate: {
    type: Date
  },
  tourDate: {
    type: Date
  },
  headNumber: {
    type: Number,
    min: 1,
    max: 20
  }

}, {
  timestamps: true
});

const BookTour = new model('BookTour', tourSchema);

module.exports = BookTour;
