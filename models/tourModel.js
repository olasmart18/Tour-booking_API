const { Schema, model } = require('mongoose');

const tourSchema = Schema({
  place: String,
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

const Tour = new model('Tour', tourSchema);

module.exports = Tour;
