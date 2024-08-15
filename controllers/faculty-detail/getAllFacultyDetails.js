const FacultyDetailsModel = require("../../models/personnel/facultyDetails");

exports.getAllFacultyDetails = async (req, res) => {
  try {
    const facultyDetails = await FacultyDetailsModel.find()
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
      data: facultyDetails,
      message: "Success retrieve All Faculty Details",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
