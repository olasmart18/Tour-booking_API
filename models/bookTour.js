const { Schema, model } = require("mongoose");

const BookedTourSchema = new Schema(
  {
    place: {
      type: String,
      required: true,
    },
    maxGroup: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    takeOffDate: {
      type: Date,
      required: true,
    },
    daysOfTour: {
      type: Number,
      required: true,
    },
    tourId: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const BookedTour = model("BookedTour", BookedTourSchema);

module.exports = BookedTour;
