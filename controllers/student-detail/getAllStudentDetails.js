const StudentDetailsModel = require("../../models/student/studentDetails");

exports.getAllStudentDetails = async (req, res) => {
  try {
    const studentDetails = await StudentDetailsModel.find().populate({
      path: "userDetailsId",
      populate: [{ path: "userAccountId", populate: {path: 'roleDetailsId'} }, { path: "personalInfoId" }],
    });

    return res.status(200).json({
      success: true,
      data: studentDetails,

      message: "Success retrieve All Student Details",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
