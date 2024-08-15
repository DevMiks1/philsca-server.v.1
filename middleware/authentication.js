const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Fetch token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {user:decoded, token:token};
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
