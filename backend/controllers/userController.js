const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Ensure the correct path to the User model
const asyncHandler = require('express-async-handler');

const upload = require('../config/multerConfig');
const path = require('path');
const fs = require('fs');

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

const signout = async (req, res) =>{

  res.clearCookie('token'); // Clear the token cookie
  res.status(200).json({ message: 'Logged out successfully' });

}


// Update user profile

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user ID is stored in req.user by auth middleware

    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user wants to remove the profile picture
    if (req.body.removeProfilePicture === 'true') {
      // Delete old profile picture if it exists and is not a default image
      if (user.profilePicture && user.profilePicture !== 'uploads/profile-pictures/default-profile.png') {
        const oldProfilePicPath = path.join(__dirname, '..', 'uploads', 'profile-pictures', path.basename(user.profilePicture));
        if (fs.existsSync(oldProfilePicPath)) {
          fs.unlinkSync(oldProfilePicPath); // Delete the old file
        }
      }
      user.profilePicture = ''; // Clear the profile picture field
    } else if (req.file) {
      // Handle file upload if a new picture is uploaded
      if (user.profilePicture && user.profilePicture !== 'uploads/profile-pictures/default-profile.png') {
        const oldProfilePicPath = path.join(__dirname, '..', 'uploads', 'profile-pictures', path.basename(user.profilePicture));
        if (fs.existsSync(oldProfilePicPath)) {
          fs.unlinkSync(oldProfilePicPath); // Delete the old file
        }
      }
      user.profilePicture = req.file.path; // Update with the new file path
    }

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

module.exports = {
  signin,
  signup,
  getUserProfile,
  signout,
  updateUserProfile,
  updateUserProfilePicture
};
