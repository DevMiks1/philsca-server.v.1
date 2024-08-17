const mongoose = require("mongoose");
const StudentDetailsModel = require("../../models/student/studentDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");

exports.updateStudentDetailsById = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const studentDetailsId = req.params.id;
    const {
      email,
      password,
      course,
      schoolYear,
      schoolId,
      isIdIssued,
      firstName,
      middleName,
      lastName,
      suffix,
      birthDate,
      address,
      contactNumber,
      contactPerson,
      contactPersonNumber,
      picture,
    } = req.body;

    // Find and verify student details
    const studentDetails = await StudentDetailsModel.findById(studentDetailsId).session(session);
    if (!studentDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student details not found" });
    }

    const { userDetailsId } = studentDetails;

    // Find and verify user details
    const userDetails = await UserDetailsModel.findById(userDetailsId).session(session);
    if (!userDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User details not found" });
    }

    const { personalInfoId, userAccountId } = userDetails;

    // Find and verify personal info and user account
    const [personalInfo, userAccount] = await Promise.all([
      PersonalInfoModel.findById(personalInfoId).session(session),
      UserAccountModel.findById(userAccountId).session(session),
    ]);

    if (!personalInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Personal info not found" });
    }

    const existingContactNumber = await PersonalInfoModel.findOne({
      contactNumber,
      _id: { $ne: personalInfoId },
    })
    if(existingContactNumber) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Contact Number is exist" });
    }
    const existingContactPersonNumber = await PersonalInfoModel.findOne({
       contactPersonNumber,
      _id: { $ne: personalInfoId },
    })
    if(existingContactPersonNumber) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "ContactPerson Number is exist" });
    }
    if (contactNumber === contactPersonNumber) {
      return res.status(400).json({
        success: false,
        message: "Contact Number and Contact Person Number cannot be the same",
      });
    }
    if (!userAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User account not found" });
    }

    // Check for existing email
    const existingEmail = await UserAccountModel.findOne({
      email,
      _id: { $ne: userAccountId },
    }).session(session);

    if (existingEmail) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Check for existing school ID
    const { roleDetailsId } = userAccount;
    const existingSchoolId = await RoleDetailsModel.findOne({
      schoolId,
      _id: { $ne: roleDetailsId },
    }).session(session);

    if (existingSchoolId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "School ID already exists" });
    }

    if (!roleDetailsId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    // Fetch and verify role details
    const roleDetails = await RoleDetailsModel.findById(roleDetailsId).session(session);
    if (!roleDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    // Update documents
    const [studentDetailsData, userAccountData, personalInfoData] = await Promise.all([
      StudentDetailsModel.findByIdAndUpdate(
        studentDetailsId,
        { course, schoolYear, schoolId, isIdIssued },
        { new: true, session }
      ),
      UserAccountModel.findByIdAndUpdate(
        userAccountId,
        { email, password },
        { new: true, session }
      ),
      PersonalInfoModel.findByIdAndUpdate(
        personalInfoId,
        {
          firstName,
          middleName,
          lastName,
          suffix,
          birthDate,
          address,
          contactNumber,
          contactPerson,
          contactPersonNumber,
          picture,
        },
        { new: true, session }
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    // Construct the response to match the desired structure
    res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      data: {
        _id: studentDetailsData._id,
        userDetailsId: {
          _id: userDetailsId,
          personalInfoId: personalInfoData,
          userAccountId: {
            ...userAccountData._doc,
            roleDetailsId: roleDetails, 
          },
        },
        isIdIssued: studentDetailsData.isIdIssued,
        course: studentDetailsData.course,
        schoolYear: studentDetailsData.schoolYear,
        schoolId: studentDetailsData.schoolId,
        createdAt: studentDetailsData.createdAt,
        updatedAt: studentDetailsData.updatedAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      error: error.message,
      message: "An error occurred while updating student details and associated documents.",
    });
  }
};
