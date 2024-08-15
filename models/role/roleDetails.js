/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleDetails = new Schema({
  schoolId: { type: String, required: false },

  role: {
    type: String,
    enum: ["student", "staff", "faculty", "admin"],
    required: true,
  },
});

module.exports = mongoose.model("RoleDetails", roleDetails);
