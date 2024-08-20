/** @format */

const jwt = require("jsonwebtoken");
const StudentDetailsModel = require("../models/student/studentDetails");
const StaffDetailsModel = require("../models/personnel/staffDetails");
const FacultyDetailsModel = require("../models/personnel/facultyDetails");
const AdminDetailsModel = require("../models/admin/adminDetails");

module.exports = async function (req, res, next) {
  // Fetch token from cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Pretty-print the decoded JWT
    const stringifyDecoded = JSON.stringify(decoded, null, 2);

    // Access nested properties
    const role = decoded.user.userDetailsId.userAccountId.roleDetailsId.role;
    // Fetch the most up-to-date user data from the appropriate collection
    let userData;
    if (role === "student") {
      userData = await StudentDetailsModel.findById(
        decoded?.user?._id
      ).populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      });
    } else if (role === "staff") {
      userData = await StaffDetailsModel.findById(decoded?.user?._id)
        .populate({
          path: "userDetailsId",
          populate: [
            { path: "userAccountId", populate: { path: "roleDetailsId" } },
            { path: "personalInfoId" },
          ],
        })
        .populate("personnelDetailsId");
    } else if (role === "faculty") {
      userData = await FacultyDetailsModel.findById(decoded?.user?._id)
        .populate({
          path: "userDetailsId",
          populate: [
            { path: "userAccountId", populate: { path: "roleDetailsId" } },
            { path: "personalInfoId" },
          ],
        })
        .populate("personnelDetailsId");
    } else if (role === "admin") {
      userData = await AdminDetailsModel.findById(decoded?.user?._id).populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      });
    }
    // console.log(userData, 'user');

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the most recent user data and token to the request
    req.user = { user: userData, token: token };

    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ message: "Token is not valid", error: error.message });
  }
};
