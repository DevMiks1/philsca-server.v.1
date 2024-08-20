const express = require("express");
const router = express.Router();
// const authentication = require("../middleware/authentication");

const {
  createUserAccount,
} = require("../controllers/user-account/createUserAccount");

// Define the route for adding a user account
router.post("/user-account",  createUserAccount);

module.exports = router;
