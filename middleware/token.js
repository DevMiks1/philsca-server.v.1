const jwt = require('jsonwebtoken');

// Middleware to verify token
exports.token = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};
