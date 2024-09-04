const express = require('express');
const { signin, signup, getUserProfile, signout, updateUserProfile, updateUserProfilePicture, removeProfilePicture } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { uploadProfilePicture } = require('../config/multerConfig');

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/signout', signout);

router.get('/profile', authenticateToken, getUserProfile);

// PUT /api/users/account/profile
router.put('/account/profile/updateProfilePicture', authenticateToken, uploadProfilePicture.single('profilePicture'), updateUserProfilePicture);

router.get('/account/profile/removeProfilePicture', authenticateToken, removeProfilePicture)

module.exports = router;
