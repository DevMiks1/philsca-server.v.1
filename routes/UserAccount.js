const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  createUserAccount,
} = require("../controllers/user-account/createUserAccount");

// Define the route for retrieving all user account
// router.get("/user-account", authMiddleware, getAllAccounts);

// Define the route for retrieving a single user account
// router.get("/user-account/:id", authMiddleware, getAccounts);

// Define the route for updating a user account
// router.patch("/user-account/:id", authMiddleware, updateAccounts);

// Define the route for adding a user account
router.post("/user-account", authentication,createUserAccount);

// Define the route for deleting a user account
// router.delete("/user-account/:id", authMiddleware, deleteAccount);

module.exports = router;
