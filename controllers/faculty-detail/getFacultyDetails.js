const FacultyDetailsModel = require("../../models/personnel/facultyDetails");

exports.getFacultyDetails = async (req, res) => {
  try {
    const facultyDetailsId = req.params.id;

    const facultyDetails = await FacultyDetailsModel.findById(facultyDetailsId)
      .populate({
        path: "userDetailsId",
        populate: [
          { path: "userAccountId", populate: { path: "roleDetailsId" } },
          { path: "personalInfoId" },
        ],
      })
      .populate("personnelDetailsId");
    if (facultyDetails) {
      return res.status(200).json({
        success: true,
        message: "Successfully Retrieved Faculty Details",
        data: facultyDetails,
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
