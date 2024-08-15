/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffDetails = new Schema({
  userDetailsId: {type: Schema.Types.ObjectId, ref: "UserDetails"},
  personnelDetailsId: { type: Schema.Types.ObjectId, ref: 'PersonnelDetails', required: true },
 
}, {
  timestamps: true
});

module.exports = mongoose.model("StaffDetails", staffDetails);
