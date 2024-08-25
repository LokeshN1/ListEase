const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile-pictures'); // Directory to save profile pictures
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append a timestamp to avoid filename conflicts
  }
});

// to store user profile picture
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only accept image files
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Configure Multer for Excel Files
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel'); // Directory to save Excel files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append a timestamp to avoid filename conflicts
  }
});

// Excel File Upload Middleware
const uploadExcel = multer({
  storage: excelStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
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
  uploadProfilePicture: upload, // Existing middleware for profile pictures
  uploadExcel // New middleware for Excel files
};
