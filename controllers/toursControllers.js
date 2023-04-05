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

// //// createTour create new tour ///////////
exports.createTour = async (req, res) => {

};

/// //  getSingleTour  get tour by id or tour name /////////
exports.getSingleTour = async (req, res) => {

};
