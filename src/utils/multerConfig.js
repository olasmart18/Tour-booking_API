const multer = require('multer');
const path = require('path');

// Use local storage
const storage = multer.diskStorage({
	// Destination: (req, file, cb) => {
	//   cb(null, "public/images");
	// },
	filename(req, file, cb) {
		cb(
			null,
			file.fieldname + '_' + Date.now() + path.extname(file.originalname),
		);
	},
});

// Init upload
const upload = multer({
	storage,
	limits: {fileSize: 100000},
	fileFilter(req, file, cb) {
		checkFileType(file, cb); // Function to filter type of file
	},
}).single('image');

// Function check file type
function checkFileType(file, cb) {
	// Allowed file
	const fileTypes = /jpeg|jpg|png|gif/;
	// Check the extnsion for the file
	const isExtType = fileTypes.test(
		path.extname(file.originalname).toLowerCase(),
	);
	// Check mime type
	const isMimeType = fileTypes.test(file.mimetype);

	if (isExtType && isMimeType) {
		return cb(null, file);
	}

	return cb({msg: 'only images is allowed'});
}

module.exports = upload;
