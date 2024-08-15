/** @format */

const UserAccountModel = require("../../models/userAccount");
const RoleDetailsModel = require("../../models/role/roleDetails");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const UserDetailsModel = require("../../models/userDetails");
const StudentDetailsModel = require("../../models/student/studentDetails");
const StaffDetailsModel = require("../../models/personnel/staffDetails");
const FacultyDetailsModel = require("../../models/personnel/facultyDetails");
const PersonnelDetailsModel = require("../../models/personnel/personnelDetails");
const AdminDetailsModel = require("../../models/admin/adminDetails");

// RESPONSIBLE TO ADD ACCOUNT

exports.createUserAccount = async (req, res) => {
  try {
    const { email, password, role, schoolId } = req.body;

    // Validate input
    if (!email || !password || !role || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for existing email
    const existingEmail = await UserAccountModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check for existing schoolId
    const existingSchoolId = await RoleDetailsModel.findOne({ schoolId });
    if (existingSchoolId) {
      return res.status(400).json({
        success: false,
        message: "School ID already exists",
      });
    }

    // Create RoleDetails document
    const roleDetails = await RoleDetailsModel.create({ schoolId, role });
    const roleDetailsId = roleDetails._id;

    // Create UserAccount document with reference to RoleDetails
    const userAccount = await UserAccountModel.create({
      email,
      password,
      roleDetailsId: roleDetailsId,
    });
    const userAccountId = userAccount._id;

    const personalInfo = await PersonalInfoModel.create({
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      address: "",
      contactNumber: "",
      contactPerson: "",
      contactPersonNumber: "",
    });
    const personalInfoId = personalInfo._id;

    const userDetails = await UserDetailsModel.create({
      personalInfoId: personalInfoId,
      userAccountId: userAccountId,
    });
    const userDetailsId = userDetails._id;

    if (role === "student") {
      await StudentDetailsModel.create({
        userDetailsId: userDetailsId,
        course: "",
        year: "",
        schoolyear: "",
        semestertype: "",
        schoolId: "",
        
      });
    } else if (role === "faculty") {
      const personnelDetails = await PersonnelDetailsModel.create({
        position: "",
        hgt: "",
        wgt: "",
        sss: "",
        tin: "",
      });
      const personnelDetailsId = personnelDetails._id;

      await FacultyDetailsModel.create({
        personnelDetailsId: personnelDetailsId,
        userDetailsId: userDetailsId,
      });
    } else if (role === "faculty") {
      const personnelDetails = await PersonnelDetailsModel.create({
        position: "",
        hgt: "",
        wgt: "",
        sss: "",
        tin: "",
      });
      const personnelDetailsId = personnelDetails._id;
      await StaffDetailsModel.create({
        personnelDetailsId: personnelDetailsId,
        userDetailsId: userDetailsId,
      });
    } else if (role === 'admin') {
      await AdminDetailsModel.create({
        userDetailsId: userDetailsId,      
      });
    }
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Account added successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add user",
      error: error.message,
    });
  }
};
