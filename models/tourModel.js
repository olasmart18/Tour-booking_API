const { Schema, model } = require("mongoose");

const tourSchema = Schema(
  {
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      data: Buffer,
      contentType: String,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      require: true,
    },
    destination: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxGroup: {
      type: Number,
      min: 1,
      max: 30,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tour = new model("Tour", tourSchema);

module.exports = Tour;
