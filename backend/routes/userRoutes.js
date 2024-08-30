const express = require('express');
const { signin, signup, getUserProfile, signout, updateUserProfile } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const { uploadProfilePicture } = require('../config/multerConfig');

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/signout', signout);

router.get('/profile', authenticateToken, getUserProfile);

// PUT /api/users/account/profile
router.put('/account/profile', authenticateToken, uploadProfilePicture.single('profilePicture'), updateUserProfile);

module.exports = router;
