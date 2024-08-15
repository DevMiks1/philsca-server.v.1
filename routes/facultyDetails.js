const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const {getFacultyDetails} = require('../controllers/faculty-detail/getFacultyDetails')
const {getAllFacultyDetails} = require('../controllers/faculty-detail/getAllFacultyDetails')
const {deleteFacultyDetailsById} = require('../controllers/faculty-detail/deleteFacultyDetails')
const {updateFacultyDetailsById} = require('../controllers/faculty-detail/updateFacultyDetails')

// Define the route for retrieving all user account
router.get("/faculty-details",authentication, getAllFacultyDetails);
// get single faculty details
router.get("/faculty-details/:id",authentication, getFacultyDetails);
// update faculty details
router.patch("/faculty-details/:id",authentication,  updateFacultyDetailsById);
// delete student details
router.delete("/faculty-details/:id",authentication, deleteFacultyDetailsById);

module.exports = router;