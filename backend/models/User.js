const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String }, // New field for first name
  lastName: { type: String }, // New field for last name
  fullName: { type: String }, // Optional: You can calculate this from first and last name if needed
  profilePicture: { type: String },
  joinDate: { type: Date, default: Date.now },
  bio: { type: String },
  location: { type: String },
  education: { type: String }, // New field for education
  mobile: { type: String }, // New field for mobile number
  linkedInProfile: { type: String }, // New field for LinkedIn profile URL
  website: { type: String }, // New field for personal website URL
  filePath : {type : String}  // to store filepath of excel file
});

module.exports = mongoose.model('User', userSchema);
