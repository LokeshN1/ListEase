const multer = require('multer');
const path = require('path');

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Middleware for uploading profile pictures
const uploadProfilePicture = multer({
  
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    console.log("in multer config for profile picture");
    // Only accept image files
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log('Mimetype:', file.mimetype);
    console.log('Extension:', path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Middleware for uploading Excel files
const uploadExcel = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    console.log("in multer config for excel file");

    console.log('Mimetype:', file.mimetype);
    console.log('Extension:', path.extname(file.originalname).toLowerCase());
    // Only accept Excel files
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Check both MIME type and file extension
    if (allowedMimes.includes(file.mimetype) && (fileExtension === '.xls' || fileExtension === '.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

module.exports = {
  uploadProfilePicture,
  uploadExcel
};
