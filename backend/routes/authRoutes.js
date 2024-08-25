const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Make sure this points to your auth middleware

// Route to check authentication status
router.get('/check-auth', authenticateToken, (req, res) => {
  // If the token is valid, `req.user` will be set by the `authenticateToken` middleware
  res.json({ authenticated: true, user: req.user });
});

module.exports = router;
