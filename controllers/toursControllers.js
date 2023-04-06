const Tour = require('../models/tourModel');

// //// allTour get all availaible tours ////////
exports.allTour = async (req, res) => {
  try {
    const tours = await Tour.find();
    if (tours.length !== 0) {
      res.status(200).json({
        success: true,
        message: 'tours found',
        data: tours
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'no tour is found',
        data: tours
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

// //// book a new tour ///////////
exports.createTour = async (req, res) => {
  const bookTour = new Tour(req.body);

  try {
    const saveTour = await bookTour.save();
    if (saveTour) {
      res.status(201).json({
        success: true,
        message: 'you have succesful book a tour',
        data: saveTour
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'failed to book tour, try again',
        data: saveTour
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

/// //  getSingleTour  get tour by id or tour name /////////
exports.getSingleTour = async (req, res) => {

};
