const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const {
  getAdminDetails,
} = require("../controllers/admin-detail/getAdminDetails");
const {
  getAllAdminDetails,
} = require("../controllers/admin-detail/getAllAdminDetails");
const {
  updateAdminDetailsById,
} = require("../controllers/admin-detail/updateAdminDetails");

// Define the route for retrieving all user account
router.get("/admin-details", authentication, getAllAdminDetails);
// get single student details
router.get("/admin-details/:id", authentication, getAdminDetails);
// update student details
router.patch("/admin-details/:id", authentication, updateAdminDetailsById);

module.exports = router;
