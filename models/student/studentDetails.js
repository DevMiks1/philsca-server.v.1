/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentDetails = new Schema(
  {
    userDetailsId: { type: Schema.Types.ObjectId, ref: "UserDetails" },
    isIdIssued: { type: Boolean, default: false, required: false },
    course: { type: String, required: false },
    schoolYear: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentDetails", studentDetails);
