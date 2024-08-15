const mongoose = require("mongoose");
const StudentDetailsModel = require("../../models/student/studentDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");

exports.deleteStudentDetailsById = async (req, res) => {
  const studentDetailsId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the StudentDetails document
    const studentDetails = await StudentDetailsModel.findById(studentDetailsId).session(session);
    if (!studentDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Student details not found" });
    }

    // Get userDetailsId from the found StudentDetails document
    const { userDetailsId } = studentDetails;

    // Find the UserDetails document
    const userDetails = await UserDetailsModel.findById(userDetailsId).session(session);
    if (!userDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User details not found" });
    }

    const { userAccountId, personalInfoId } = userDetails;

    // Find UserAccount and PersonalInfo in parallel
    const [userAccount, personalInfo] = await Promise.all([
      UserAccountModel.findById(userAccountId).session(session),
      PersonalInfoModel.findById(personalInfoId).session(session),
    ]);

    if (!userAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User account not found" });
    }

    const { roleDetailsId } = userAccount;

    if (!personalInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Personal info not found" });
    }

    if (!roleDetailsId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    // Delete associated documents
    await Promise.all([
      RoleDetailsModel.findByIdAndDelete(roleDetailsId).session(session),
      UserAccountModel.findByIdAndDelete(userAccountId).session(session),
      PersonalInfoModel.findByIdAndDelete(personalInfoId).session(session),
      UserDetailsModel.findByIdAndDelete(userDetailsId).session(session),
      StudentDetailsModel.findByIdAndDelete(studentDetailsId).session(session),
    ]);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Student details and associated documents deleted successfully",
    });
  } catch (error) {
    // Abort transaction and end session if an error occurs
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      error: error.message,
      message: "An error occurred while deleting student details and associated documents.",
    });
  }
};
