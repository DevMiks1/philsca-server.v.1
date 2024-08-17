const mongoose = require("mongoose");
const FacultyDetailsModel = require("../../models/personnel/facultyDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");
const PersonnelDetailsModel = require("../../models/personnel/personnelDetails");

exports.updateFacultyDetailsById = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const facultyDetailsId = req.params.id;
    const {
      email,
      password,
      position,
      designation,
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
      birthDate,
      address,
      contactNumber,
      contactPerson,
      contactPersonNumber,
      picture,
    } = req.body;

    const facultyDetails = await FacultyDetailsModel.findById(
      facultyDetailsId
    ).session(session);

    if (!facultyDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Faculty details not found" });
    }

    // Get userDetailsId from the found StudentDetails document
    const { userDetailsId } = facultyDetails;

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
      PersonalInfoModel.findById(personalInfoId).session(session),
      UserAccountModel.findById(userAccountId).session(session),
    ]);

    if (!personalInfo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Personal info not found",
      });
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

    const { personnelDetailsId } = facultyDetails;

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
          birthDate,
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
        { position, hgt, wgt, sss, tin, isIdIssued, designation },
        { new: true, session }
      ),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Faculty details updated successfully",
      data: {
        _id: facultyDetails._id,
        personnelDetailsId: personnelDetailsData,
        userDetailsId: {
          _id: userDetailsId,
          personalInfoId: personalInfoData,
          userAccountId: {
            ...userAccountData._doc,
            roleDetailsId: roleDetailsData, 
          },
        },
        
        createdAt: facultyDetails.createdAt,
        updatedAt: facultyDetails.updatedAt,
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
