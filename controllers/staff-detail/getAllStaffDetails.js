const StaffDetailsModel = require("../../models/personnel/staffDetails");

exports.getAllStaffDetails = async (req, res) => {
  try {
    const staffDetails = await StaffDetailsModel.find()
      .populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      })
      .populate("personnelDetailsId");

    return res.status(200).json({
      success: true,
      data: staffDetails,
      message: "Success retrieve All Faculty Details",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
