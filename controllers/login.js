const UserAccountModel = require("../models/userAccount");
const RoleDetailsModel = require("../models/role/roleDetails");
const UserDetailsModel = require("../models/userDetails");
const StudentDetailsModel = require("../models/student/studentDetails");
const StaffDetailsModel = require("../models/personnel/staffDetails");
const FacultyDetailsModel = require("../models/personnel/facultyDetails");
const AdminDetailsModel = require("../models/admin/adminDetails");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await UserAccountModel.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    // Ensure the role is associated with the user
    const existingRole = await RoleDetailsModel.findOne({
      _id: user.roleDetailsId,
      role: role,
    });

    if (!existingRole) {
      return res.status(401).send("Invalid role credentials");
    }

    // Compare passwords (this should be hashed in a real-world application)
    if (password !== user.password) {
      return res.status(401).send("Email or Password is incorrect");
    }

    // Fetch user details
    const userDetails = await UserDetailsModel.findOne({ userAccountId: user._id });
    if (!userDetails) {
      return res.status(404).send("User details not found");
    }

    let userData;
    // Fetch additional user data based on role
    if (role === 'admin') {
      userData = await AdminDetailsModel.findOne({ userDetailsId: userDetails._id })
        .populate({
          path: 'userDetailsId',
          populate: [
            { path: 'userAccountId', populate: { path: 'roleDetailsId' } },
            { path: 'personalInfoId' }
          ]
        });
    } else if (role === 'student') {
      userData = await StudentDetailsModel.findOne({ userDetailsId: userDetails._id })
      .populate({
        path: "userDetailsId",
        populate: [{ path: "userAccountId", populate: {path: 'roleDetailsId'} }, { path: "personalInfoId" }]
      });
    } else if (role === 'faculty') {
      userData = await FacultyDetailsModel.findOne({ userDetailsId: userDetails._id })
      .populate({
        path: "userDetailsId",
        populate: [{ path: "userAccountId", populate: { path: "roleDetailsId" } },{ path: "personalInfoId" },
        ],
      })
      .populate("personnelDetailsId");
    } else if (role === 'staff') {
      userData = await StaffDetailsModel.findOne({ userDetailsId: userDetails._id })
      .populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      })
      .populate("personnelDetailsId");
    }

    if (!userData) {
      return res.status(404).send("User details not found for the given role");
    }
    // Generate JWT token
    const token = jwt.sign({ user: userData}, JWT_SECRET, { expiresIn: "1h" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: true, // Cookie is only sent over HTTPS
      sameSite: "Strict", // Helps prevent CSRF attacks
    });

    res.status(200).json({
      token: token,
      message: "Successfully Logged In",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
