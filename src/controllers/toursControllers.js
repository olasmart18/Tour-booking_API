const statusCode = require('http-status');
const Tour = require('../models/tourModel');
const BookTour = require('../models/bookTour');
const BookedTour = require('../models/bookTour');
const upload = require('../utils/multerConfig');
const uploadToCloudinary = require('../utils/cloudinary');
const CustomError = require('../middlewares/error');
const {asyncWrapper} = require('../utils/asyncWrapper');

// //// create a new tour ///////////
exports.createTour = asyncWrapper(async (req, res, next) => {
	// Call the upload method
	upload(req, res, async err => {
		if (err) {
			const error = new CustomError(err.message, statusCode.BAD_REQUEST);
			return next(error);
		}

		// Upload image to cloudinary
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
				message: 'you have succesfully create tour',
				data: tour,
			});
		} else {
			const error = new CustomError(
				'ssomething went wrong, ty again',
				statusCode.BAD_REQUEST,
			);
			return next(error);
		}
	});
});

// //// allTour get all availaible tours ////////
exports.allTour = asyncWrapper(async (req, res, next) => {
	const tours = await Tour.find({});
	if (tours.length !== 0) {
		res.status(200).json({
			status: 'success',
			message: 'tours found',
			data: tours,
		});
	} else {
		res.status(200).json({
			status: 'success',
			message: 'no tour is found',
			data: null,
		});
	}
});

/// //  getSingleTour  get tour by id or tour name /////////
exports.getSingleTour = asyncWrapper(async (req, res, next) => {
	const tourId = req.params.id;
	const findTourById = await Tour.findOne({_id: tourId});
	if (!findTourById) {
		const error = new CustomError('tour with the ID not fown', 404);
		return next(error);
	}

	res.status(200).json({
		success: true,
		message: 'tour found',
		data: findTourById,
	});
});

/// delete single tours ////////
exports.deleteSingleTour = asyncWrapper(async (req, res, next) => {
	const id = req.params.tourId;
	const isTour = await Tour.findByIdAndDelete(id);
	if (!isTour) {
		const error = new CustomError('tour with the ID not fown', 404);
		return next(error);
	}

	res.status(statusCode.OK).json({
		success: true,
		message: 'deleted  tours from database',
		data: isTour,
	});
});

// ////delete all tours//////////
exports.deleteTours = asyncWrapper(async (req, res, next) => {
	const deleteTours = await Tour.deleteMany();
	if (!deleteTours) {
		const error = new CustomError('unable to delete tours', statusCode.BAD_REQUEST);
		return next(error);
	}

	res.status(200).json({
		success: true,
		message: 'successful',
	});
});

// ////update tour ///// access: only Admin /////
exports.updateTour = asyncWrapper(async (req, res, next) => {
	const TourId = req.params.id;
	const updateTour = await Tour.findByIdAndUpdate(
		TourId,
		{$set: req.body},
		{new: true},
	);
	if (!updateTour) {
		const error = new CustomError('tour with the ID not found', 404);
		return next(error);
	}

	res.status(200).json({
		success: true,
		message: 'tour has been updated',
		data: updateTour,
	});
});

// Book a tour
exports.BookTour = asyncWrapper(async (req, res, next) => {
	const {_id: userId} = req.user;
	const {tourId} = req.params;

	const isTour = await Tour.findById(tourId);
	if (!isTour) {
		const error = new CustomError('tour with the ID not found', 404);
		return next(error);
	}

	const bookNewTour = new BookTour({
		place: req.body.place,
		maxGroup: req.body.maxGroup,
		takeOffDate: req.body.takeOffDate,
		daysOfTour: req.body.daysOfTour,
		tourId,
		userId,
	});
	await bookNewTour.save();
	return res.status(statusCode.CREATED).json({
		message: 'your tour has been booked, please save the ID you recieve',
		data: bookNewTour._id,
	});
});

// Get a booked tour
exports.getBookedTour = asyncWrapper(async (req, res, next) => {
	const {tourId} = req.body;
	const isTour = await BookTour.findOne({_id: tourId});
	if (!isTour) {
		const error = new CustomError('tour with the ID not found', 404);
		return next(error);
	}

	return res.status(statusCode.OK).json({
		message: 'successful',
		data: isTour,
	});
});

// Update booked tour
exports.updateBookedTour = asyncWrapper(async (req, res, next) => {
	const {tourId} = req.params;
	const isBookedTour = await BookedTour.findById(tourId);
	if (!isBookedTour) {
		const error = new CustomError('tour with the ID not found', 404);
		return next(error);
	}

	await BookedTour.findByIdAndUpdate(
		tourId,
		{$set: req.body},
		{new: true},
	).then(() => {
		res.status(statusCode.CREATED).json({
			message: 'your data has been updated',
		});
	});
});

// Get tour by search // access: User $ Admin
exports.searchTour = asyncWrapper(async (req, res, next) => {
	const {searchValue} = req.query;

	// Const searchById = req.query.id;
	// const place = new RegExp(req.query.place, "i"); // i means case insensitive
	// const destination = req.query.destination;
	// const maxGroup = parseInt(req.query.maxGroup);
	// const distance = parseInt(req.query.distance);

	if (!searchValue) {
		res.status(statusCode.BAD_REQUEST).json({
			message: 'provide a search query'
		});
	}

	// Build the search criteria
	const searchCriteria = {
		$or: [
			// Assuming `_id` is the field to search by ID
			{destination: searchValue},
			{place: new RegExp(searchValue, 'i')},
			{distance: {$gte: parseInt(searchValue)}},
			{maxGroup: {$gte: parseInt(searchValue)}},
		],
	};
	// Remove undefined or null criteria
	Object.keys(searchCriteria).forEach(key => {
		searchCriteria[key] === undefined && delete searchCriteria[key];
	});

	console.log(searchCriteria);

	const tour = await Tour.find(searchCriteria);
	res.status(200).json({
		success: true,
		message: 'search found',
		data: tour,
	});
});
