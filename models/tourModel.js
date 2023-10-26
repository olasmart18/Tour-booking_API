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
  maxGroup: {
    type: Number,
    min: 1,
    max: 50
  },
  distance: {
    type: Number,
    required: true
  }

}, {
  timestamps: true
});

const BookTour = new model('BookTour', tourSchema);

module.exports = BookTour;
