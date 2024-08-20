const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');

// Example of a protected route
router.get('/auth', authentication, (req, res) => {
  res.json({
    user: req.user.user,
    token:req.user.token
  });
    console.log(req.user.user);
});

module.exports = router;
