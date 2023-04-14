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

// //// create a new tour ///////////
exports.createTour = async (req, res) => {
  const bookTour = new Tour(req.body);

  try {
    const saveTour = await bookTour.save();
    if (saveTour) {
      res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

/// //  getSingleTour  get tour by id or tour name /////////
exports.getSingleTour = async (req, res) => {
  const tourId = req.params.id;

  try {
    const findTourById = await Tour.findOne({ _id: tourId });
    if (!findTourById) {
      return res.status(404).json({
        success: false,
        message: 'not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'tour found',
      data: findTourById
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'no tour is found, try again'
    });
  }
};

/// delete single tours ////////
exports.deleteSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteTour = await Tour.findByIdAndDelete(id);
    if (!deleteTour) {
      return res.status(404).json({
        success: false,
        message: 'not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'deleted  tours from database',
      data: deleteTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

// ////delete all tours//////////
exports.deleteTours = async (req, res) => {
  try {
    const deleteTours = await Tour.deleteMany();
    res.status(200).json({
      success: true,
      message: 'successful',
      data: deleteTours
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

// ////update tour //////////
exports.updateTour = async (req, res) => {
  const TourId = req.params.id;
  try {
    const updateTour = await Tour.findByIdAndUpdate(TourId,
      { $set: req.body }, { new: true });
    if (!updateTour) {
      res.status(404).json({
        success: false,
        message: 'not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'tour has been updated',
      data: updateTour
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};
