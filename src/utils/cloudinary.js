const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

// Middleware to handle image upload to Cloudinary
const uploadToCloudinary = file => new Promise((resolve, reject) => {
	cloudinary.uploader.upload(file.path, {folder: 'tour-images'}, (error, result) => {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
});

module.exports = uploadToCloudinary;
