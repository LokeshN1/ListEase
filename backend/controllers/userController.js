const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Ensure the correct path to the User model
const asyncHandler = require('express-async-handler');

const upload = require('../config/multerConfig');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary');

// SignUp -: create a new user

const signup = async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user with default values for optional fields
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      fullName: '',
      profilePicture: '',
      joinDate: Date.now(),
      bio: '',
      location: '',
      education: '',
      mobile: '',
      linkedInProfile: '',
      website: ''
    });

    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'None', // Allows cross-site cookies
      maxAge: 3600000  // 1 hour in milliseconds

    });

    // Exclude sensitive information from the user object
      const { password: _, ...userWithoutPassword } = user.toObject();

    // Return the user data along with the success message
      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup };



// SignIn user and generate token
const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token as an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // use secure cookies in production
      sameSite: 'None', // Allows cross-site cookies
      maxAge: 3600000  // 1 hour in milliseconds
    });
    
    // Exclude sensitive information from the user object
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return the user data along with the success message
    res.json({ message: 'Sign in successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign Out
const signout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};


// Get user details
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user ID is stored in req.user by auth middleware
    const user = await User.findById(userId).select('-password'); // Exclude password
    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update user profile

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user ID is stored in req.user by auth middleware

    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Details to be update: ", req.body);

    // Update user fields from request body
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.education = req.body.education || user.education;
    user.mobile = req.body.mobile || user.mobile;
    user.linkedInProfile = req.body.linkedInProfile || user.linkedInProfile;
    user.website = req.body.website || user.website;

    // Save the updated user
    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      location: updatedUser.location,
      education: updatedUser.education,
      mobile: updatedUser.mobile,
      linkedInProfile: updatedUser.linkedInProfile,
      website: updatedUser.website
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


const updateUserProfilePicture = async (req, res) => {
  try {
    if (req.file) {
      const userId = req.user.id; // Assuming you're using a middleware that sets req.user
      const user = await User.findById(userId);
      const previousImgUrl = user.profilePicture;

    console.log("Info about profile picture also its datatype"+ previousImgUrl+"\t"+typeof(previousImgUrl));
    if(previousImgUrl != undefined){ // if their exist a profile picture 
  // first delete the previous profile picture from cloudnary
      const publicId = extractPublicId(previousImgUrl);
      await deleteImageFromCloudinary(publicId);
    }
       

      const imageUrl = req.file.path; // Cloudinary URL
  
      // Save the imageUrl to the user's profile in your database
      await User.findByIdAndUpdate(req.user.id, { profilePicture: imageUrl });

      res.status(200).json({ message: 'Profile picture updated successfully', imageUrl });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete profile picture from cloudnary in case user either removes its profile picture or update a new profile picture

// Delete file from cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error('Public ID is not provided');
    }
    
    // Ensure the publicId is in the correct format (remove file extension if included)
    const resourceType = 'image'; // Adjust based on file type
    
    console.log('Attempting to delete file with Public ID:', publicId);
    
    const result = await cloudinary.v2.api.delete_resources([publicId], { resource_type: resourceType });
    
    if (result.deleted[publicId] === 'not found') {
      throw new Error('File not found on Cloudinary');
    }

    console.log('File deleted successfully:', result);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Error deleting file from Cloudinary');
  }
};

// Function to extract public_id starting from "/profile_pictures/"
const extractPublicId = (url) => {
  // Find the index of "/profile_pictures/"
  const startIndex = url.indexOf('/profile_pictures/');
  
  if (startIndex === -1) {
    throw new Error('Public ID not found in URL');
  }

  // Adjust the start index to be right after "/profile_pictures/"
  const start = startIndex + 1; 

  // Find the end index (where the file extension starts)
  const endIndex = url.lastIndexOf('.');
  
  if (endIndex === -1) {
    throw new Error('File extension not found in URL');
  }

  // Extract the public ID
  const publicId = url.substring(start, endIndex); 

  return publicId;
};

const removeProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using a middleware that sets req.user
    const user = await User.findById(userId);

    if (user.profilePicture) {
      // Extract the public ID from the profile picture URL
      const publicId = extractPublicId(user.profilePicture);
      console.log("Profile picture public ID:", publicId);

      // Delete the profile picture from Cloudinary
      await deleteImageFromCloudinary(publicId);

      // Remove the profile picture from the database
      user.profilePicture = '';
      await user.save();

      res.status(200).json({ message: 'Profile picture removed successfully' });
    } else {
      res.status(400).json({ message: 'No profile picture to remove' });
    }
  } catch (error) {
    console.error('Error removing profile picture:', error);
    res.status(500).json({ message: 'Error removing profile picture' });
  }
};

module.exports = {
  signin,
  signup,
  getUserProfile,
  signout,
  updateUserProfile,
  updateUserProfilePicture,
  removeProfilePicture
};
