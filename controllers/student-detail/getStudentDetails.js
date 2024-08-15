const StudentDetailsModel = require("../../models/student/studentDetails");

exports.getStudentDetails = async (req, res) => {
  try {
    const studentDetailsId = req.params.id;

    const studentDetails = await StudentDetailsModel.findById(
      studentDetailsId
    ).populate({
      path: "userDetailsId",
      populate: [
        { path: "userAccountId", populate: { path: "roleDetailsId" } },
        { path: "personalInfoId" },
      ],
    });

    if (studentDetails) {
      return res.status(200).json({
        success: true,
        message: "Successfully Retrieved Student Details",
        data: studentDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Student Details not found",
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
