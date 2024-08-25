const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies
  console.log(token);
  if (!token) return res.status(401).json({ authenticated: false, message: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ authenticated: false, message: 'Token is not valid' });
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
