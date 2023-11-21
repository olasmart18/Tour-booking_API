const multer = require("multer");
const path = require("path");

// use local storage
const storage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "public/images");
  // },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); // function to filter type of file
  },
}).single("image");

// function check file type
function checkFileType(file, cb) {
  // allowed file
  const fileTypes = /jpeg|jpg|png|gif/;
  // check the extnsion for the file
  const isExtType = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // check mime type
  const isMimeType = fileTypes.test(file.mimetype);

  if (isExtType && isMimeType) {
    return cb(null, file);
  } else {
    return cb({ msg: "only images is allowed" });
  }
}

module.exports = upload;
