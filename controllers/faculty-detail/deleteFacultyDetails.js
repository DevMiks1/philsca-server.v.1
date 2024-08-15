const mongoose = require('mongoose');
const FacultyDetailsModel = require("../../models/personnel/facultyDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");
const PersonnelDetailsModel = require("../../models/personnel/personnelDetails");

exports.deleteFacultyDetailsById = async (req, res) => {
  const facultyDetailsId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the Faculty Details document
    const facultyDetails = await FacultyDetailsModel.findById(facultyDetailsId).session(session);
    if (!facultyDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Faculty details not found" });
    }

    const { userDetailsId, personnelDetailsId } = facultyDetails;

    // Parallel fetching of user details and personnel details
    const [userDetails, personnelDetails] = await Promise.all([
      UserDetailsModel.findById(userDetailsId).session(session),
      PersonnelDetailsModel.findById(personnelDetailsId).session(session),
    ]);

    if (!userDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User details not found" });
    }
    if (!personnelDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Personnel details not found" });
    }

    const { userAccountId, personalInfoId } = userDetails;

    // Find the UserAccount document
    const userAccount = await UserAccountModel.findById(userAccountId).session(session);
    if (!userAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User account not found" });
    }
    const { roleDetailsId } = userAccount;

    // Ensure all related documents exist
    const [personalInfo, roleDetails] = await Promise.all([
      PersonalInfoModel.findById(personalInfoId).session(session),
      RoleDetailsModel.findById(roleDetailsId).session(session),
    ]);

    if (!personalInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Personal info not found" });
    }
    if (!roleDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    // Delete operations in reverse order of dependencies
    await Promise.all([
      RoleDetailsModel.findByIdAndDelete(roleDetailsId).session(session),
      UserAccountModel.findByIdAndDelete(userAccountId).session(session),
      PersonalInfoModel.findByIdAndDelete(personalInfoId).session(session),
      UserDetailsModel.findByIdAndDelete(userDetailsId).session(session),
      PersonnelDetailsModel.findByIdAndDelete(personnelDetailsId).session(session),
      FacultyDetailsModel.findByIdAndDelete(facultyDetailsId).session(session),
    ]);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Faculty details and associated documents deleted successfully",
    });
  } catch (error) {
    // Abort transaction and end session if an error occurs
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      error: error.message,
      message: "An error occurred while deleting faculty details and associated documents.",
    });
  }
};
