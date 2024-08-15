/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personalInfo = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  middleName: {type: String, required:false},
  suffix: { type: String, required: false },
  address: { type: String, required: false },
  contactNumber: { type: String, required: false },
  contactPerson: { type: String, required: false },
  contactPersonNumber: { type: String, required: false },
  picture: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("PersonalInfo", personalInfo);
