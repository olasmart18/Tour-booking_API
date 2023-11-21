const statusCode = require("http-status");
const Tour = require("../models/tourModel");
const BookTour = require("../models/bookTour");
const BookedTour = require("../models/bookTour");
const imageUpload = require("../models/images");
const upload = require("../utils/multerConfig");
const uploadToCloudinary = require("../utils/cloudinary");

// //// create a new tour ///////////
exports.createTour = async (req, res) => {
  try {
    // call the upload method
    upload(req, res, async (err) => {
      if (err) {
        res.status(statusCode.BAD_REQUEST).json({ mesage: err.msg });
      } else {
        try {
          const cloudUpload = await uploadToCloudinary(req.file);
          const newTour = new Tour({
            image: {
              public_id: cloudUpload.public_id,
              url: cloudUpload.secure_url,
              data: req.file.filename,
              contentType: req.file.mimetype,
            },
            country: req.body.country,
            state: req.body.state,
            destination: req.body.destination,
            description: req.body.description,
            maxGroup: req.body.maxGroup,
            distance: req.body.distance,
          });
          const tour = await newTour.save();
          if (tour) {
            res.status(statusCode.CREATED).json({
              success: true,
              message: "you have succesfully create tour",
              data: tour,
            });
          } else {
            res.status(statusCode.BAD_REQUEST).json({
              success: false,
              message: "failed to create tour, try again",
            });
          }
        } catch (err) {
          res.status(statusCode.INTERNAL_SERVER_ERROR).json({
            message: "error occur while uploading image " + err.message,
          });
        }
      }
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong, try again " + err.message,
    });
  }
};

// //// allTour get all availaible tours ////////
exports.allTour = async (req, res) => {
  try {
    const tours = await Tour.find({});
    if (tours.length !== 0) {
      res.status(200).json({
        success: true,
        message: "tours found",
        data: tours,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "no tour is found",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed, try again",
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
        message: "not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "tour found",
      data: findTourById,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "no tour is found, try again",
    });
  }
};

/// delete single tours ////////
exports.deleteSingleTour = async (req, res) => {
  const id = req.params.tourId;
  try {
    const isTour = await Tour.findByIdAndDelete(id);
    if (!isTour) {
      return res.status(404).json({
        success: false,
        message: "not found",
      });
    } else {
      res.status(statusCode.OK).json({
        success: true,
        message: "deleted  tours from database",
        data: isTour,
      });
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong, try again " + err.message,
    });
  }
};

// ////delete all tours//////////
exports.deleteTours = async (req, res) => {
  try {
    const deleteTours = await Tour.deleteMany();
    if (!deleteTours) {
      res.status(statusCode.BAD_REQUEST).json({
        message: err.message,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successful",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong, try again",
    });
  }
};

// ////update tour ///// access: only Admin /////
exports.updateTour = async (req, res) => {
  const TourId = req.params.id;
  try {
    const updateTour = await Tour.findByIdAndUpdate(
      TourId,
      { $set: req.body },
      { new: true }
    );
    if (!updateTour) {
      res.status(404).json({
        success: false,
        message: "not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "tour has been updated",
      data: updateTour,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong, try again",
    });
  }
};

// book a tour
exports.BookTour = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { tourId } = req.params;

    const isTour = await Tour.findById(tourId);
    if (!isTour) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "tour not found",
      });
    } else {
      const bookNewTour = new BookTour({
        place: req.body.place,
        maxGroup: req.body.maxGroup,
        takeOffDate: req.body.takeOffDate,
        daysOfTour: req.body.daysOfTour,
        tourId: tourId,
        userId: userId,
      });
      await bookNewTour.save();
      return res.status(statusCode.CREATED).json({
        message: "your tour has been booked, please save the ID you recieve",
        data: bookNewTour._id,
      });
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// get a booked tour
exports.getBookedTour = async (req, res) => {
  try {
    const { tourId } = req.body;
    const isTour = await BookTour.findOne({ _id: tourId });
    if (!isTour) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "not found",
      });
    } else {
      return res.status(statusCode.OK).json({
        message: "successful",
        data: isTour,
      });
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// update booked tour
exports.updateBookedTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const isBookedTour = await BookedTour.findById(tourId);
    if (!isBookedTour) {
      res.status(statusCode.NOT_FOUND).json({
        message: "not found",
      });
    } else {
      await BookedTour.findByIdAndUpdate(
        tourId,
        { $set: req.body },
        { new: true }
      ).then(() => {
        res.status(statusCode.CREATED).json({
          message: "your data has been updated",
        });
      });
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// get tour by search // access: User $ Admin
exports.searchTour = async (req, res) => {
  try {
    const searchValue = req.query.searchValue;

    // const searchById = req.query.id;
    // const place = new RegExp(req.query.place, "i"); // i means case insensitive
    // const destination = req.query.destination;
    // const maxGroup = parseInt(req.query.maxGroup);
    // const distance = parseInt(req.query.distance);

    if (!searchValue) {
      res.status(statusCode.BAD_REQUEST).json({
        message: "provide a search query " + err.message,
      });
    }

    // Build the search criteria
    const searchCriteria = {
      $or: [
        // Assuming `_id` is the field to search by ID
        { destination: searchValue },
        { place: new RegExp(searchValue, "i") },
        { distance: { $gte: parseInt(searchValue) } },
        { maxGroup: { $gte: parseInt(searchValue) } },
      ],
    };
    // Remove undefined or null criteria
    Object.keys(searchCriteria).forEach((key) => {
      searchCriteria[key] === undefined && delete searchCriteria[key];
    });

    console.log(searchCriteria);

    const tour = await Tour.find(searchCriteria);
    res.status(200).json({
      success: true,
      message: "search found",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "search does not match any results",
    });
    console.log(err);
  }
};
