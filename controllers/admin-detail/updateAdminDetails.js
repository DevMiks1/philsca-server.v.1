const mongoose = require("mongoose");
const AdminDetailsModel = require("../../models/admin/adminDetails");
const UserDetailsModel = require("../../models/userDetails");
const UserAccountModel = require("../../models/userAccount");
const PersonalInfoModel = require("../../models/personal/personalInfo");
const RoleDetailsModel = require("../../models/role/roleDetails");

exports.updateAdminDetailsById = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const adminDetailsId = req.params.id;
    const {
      email,
      password,
      schoolId,
      firstName,
      middleName,
      lastName,
      suffix,
      address,
      birthDate,
      contactNumber,
      contactPerson,
      contactPersonNumber,
      picture,
    } = req.body;

    const adminDetails = await AdminDetailsModel.findById(
      adminDetailsId
    ).session(session);
    if (!adminDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Admin details not found" });
    }

    const { userDetailsId } = adminDetails;

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
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Email is already exist",
      });
    }

    const { roleDetailsId } = userAccount;

    const existingSchoolId = await RoleDetailsModel.findOne({
      schoolId,
      _id: { $ne: roleDetailsId },
    }).session(session);

    if (existingSchoolId) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: "School ID is already exist",
      });
    }
    if (!roleDetailsId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Role details not found" });
    }

    const [userAccountData, roleDetailsData, personalInfoData,  ] = await Promise.all([
      
      UserAccountModel.findByIdAndUpdate(
        userAccountId,
        { email, password },
        { new: true, session },
        
      ),
      RoleDetailsModel.findByIdAndUpdate(
        roleDetailsId,
        { schoolId },
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
    
    await session.commitTransaction()
    session.endSession()
     

    res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
      data: {
        _id: adminDetails._id,
        userDetailsId: {
          _id: userDetailsId,
          personalInfoId: personalInfoData,
          userAccountId: {
            ...userAccountData._doc,
            roleDetailsId: roleDetailsData, 
          },
        },
        
        createdAt: adminDetails.createdAt,
        updatedAt: adminDetails.updatedAt,
      },
    });
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
     
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: "An error occurred while updating admin details and associated documents.",
    });
  }
};
