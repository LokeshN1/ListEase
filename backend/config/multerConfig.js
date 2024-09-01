const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path'); // Import the path module to use path.extname

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures', // Folder name in Cloudinary
    format: async (req, file) => 'png', // Convert files to PNG format
    public_id: (req, file) => `${req.user.id}_${Date.now()}`, // Set a unique file name
  },
});

// Multer middleware for uploading profile pictures
const uploadProfilePicture = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    console.log("User profile picture uploading!");
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
  },
});

// Multer middleware for uploading Excel files
const uploadExcel = multer({
  storage: multer.memoryStorage(), // Store Excel files in memory
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    console.log("Excel file uploading!");

    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.mimetype)) {
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
