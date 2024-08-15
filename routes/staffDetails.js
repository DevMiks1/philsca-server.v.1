const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const {getStaffDetails} = require('../controllers/staff-detail/getStaffDetails')
const {getAllStaffDetails} = require('../controllers/staff-detail/getAllStaffDetails')
const {deleteStaffDetailsById} = require('../controllers/staff-detail/deleteStaffDetails')
const {updateStaffDetailsById} = require('../controllers/staff-detail/updateStaffDetails')

// Define the route for retrieving all user account
router.get("/staff-details", authentication,getAllStaffDetails);
// get single student details
router.get("/staff-details/:id", authentication,getStaffDetails);
// update staff details
router.patch("/staff-details/:id",  authentication,updateStaffDetailsById);
// delete student details
router.delete("/staff-details/:id", authentication,deleteStaffDetailsById);

module.exports = router;