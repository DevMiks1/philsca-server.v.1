const mongoose = require("mongoose");
const StaffDetailsModel = require("../../models/personnel/staffDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");
const PersonnelDetailsModel = require("../../models/personnel/personnelDetails");

exports.updateStaffDetailsById = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const staffDetailsId = req.params.id;
    const {
      email,
      password,
      position,
      hgt,
      wgt,
      sss,
      tin,
      schoolId,
      isIdIssued,
      firstName,
      middleName,
      lastName,
      suffix,
      address,
      contactNumber,
      contactPerson,
      contactPersonNumber,
      picture,
    } = req.body;

    const staffDetails = await StaffDetailsModel.findById(
      staffDetailsId
    ).session(session);

    if (!staffDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Faculty details not found" });
    }

    // Get userDetailsId from the found StudentDetails document
    const { userDetailsId } = staffDetails;

    // Find the UserDetails document
    const userDetails = await UserDetailsModel.findById(userDetailsId).session(
      session
    );

    if (!userDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User details not found" });
    }

    const { personalInfoId, userAccountId } = userDetails;

    const [personalInfo, userAccount] = await Promise.all([
      UserAccountModel.findById(userAccountId).session(session),
      PersonalInfoModel.findById(personalInfoId).session(session),
    ]);

    if (!personalInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Personal info not found",
      });
    }
    
    if (!userAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User account not found" });
    }

    const existingEmail = await UserAccountModel.findOne({
      email,
      _id: { $ne: userAccountId },
    }).session(session);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already exist",
      });
    }
    const { roleDetailsId } = userAccount;

    if (!roleDetailsId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    const existingSchoolId = await RoleDetailsModel.findOne({
      schoolId,
      _id: { $ne: roleDetailsId },
    }).session(session);

    if (existingSchoolId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "School ID is already exist",
      });
    }

    const { personnelDetailsId } = staffDetails;

    if (!personnelDetailsId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Personnel Details not found" });
    }

    const [
      roleDetailsData,
      userAccountData,
      personalInfoData,
      personnelDetailsData,
    ] = await Promise.all([
      RoleDetailsModel.findByIdAndUpdate(
        roleDetailsId,
        { schoolId },
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
          address,
          contactNumber,
          contactPerson,
          contactPersonNumber,
          picture,
        },
        { new: true }
      ),
      PersonnelDetailsModel.findByIdAndUpdate(
        personnelDetailsId,
        { position, hgt, wgt, sss, tin, isIdIssued },
        { new: true, session }
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Faculty details updated successfully",
      data: {
        personnelDetailsData,
        userAccountData,
        personalInfoData,
        roleDetailsData,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating faculty details and associated documents.",
      error: error.message,
    });
  }
};
