const AdminDetailsModel = require("../../models/admin/adminDetails");

exports.getAdminDetails = async (req, res) => {
  try {
    const adminDetailsId = req.params.id;

    const adminDetails = await AdminDetailsModel.findById(
      adminDetailsId
    ).populate({
      path: "userDetailsId",
      populate: [
        { path: "userAccountId", populate: { path: "roleDetailsId" } },
        { path: "personalInfoId" },
      ],
    });

    if (adminDetails) {
      return res.status(200).json({
        success: true,
        message: "Successfully Retrieved Admin Details",
        data: adminDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Admin Details not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
