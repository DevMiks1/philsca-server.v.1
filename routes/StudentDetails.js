const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const {getStudentDetails} = require('../controllers/student-detail/getStudentDetails')
const {getAllStudentDetails} = require('../controllers/student-detail/getAllStudentDetails')
const {deleteStudentDetailsById} = require('../controllers/student-detail/deleteStudentDetails')
const {updateStudentDetailsById} = require('../controllers/student-detail/updateStudentDetails')

// Define the route for retrieving all user account
router.get("/student-details", authentication,getAllStudentDetails);
// get single student details
router.get("/student-details/:id", authentication,getStudentDetails);
// update student details
router.patch("/student-details/:id", authentication, updateStudentDetailsById);
// delete student details
router.delete("/student-details/:id", authentication,deleteStudentDetailsById);

module.exports = router;