const AdminDetailsModel = require("../../models/admin/adminDetails");

exports.getAllAdminDetails = async (req, res) => {
  try {
    const adminDetails = await AdminDetailsModel.find().populate({
      path: "userDetailsId",
      populate: [{ path: "userAccountId", populate: {path: 'roleDetailsId'} }, { path: "personalInfoId" }],
    });

    return res.status(200).json({
      success: true,
      data: adminDetails,

      message: "Success retrieve All Admin Details",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
