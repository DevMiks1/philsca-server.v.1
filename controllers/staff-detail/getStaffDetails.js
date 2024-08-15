const StaffDetailsModel = require("../../models/personnel/staffDetails");

exports.getStaffDetails = async (req, res) => {
  try {
    const staffDetailsId = req.params.id;

    const staffDetails = await StaffDetailsModel.findById(staffDetailsId)
      .populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      })
      .populate("personnelDetailsId");
    if (staffDetails) {
      return res.status(200).json({
        success: true,
        message: "Successfully Retrieved Faculty Details",
        data: staffDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Faculty Details not found",
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
