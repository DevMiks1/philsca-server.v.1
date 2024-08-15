/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminDetails = new Schema({
  userDetailsId: { type: Schema.Types.ObjectId, ref: "UserDetails" },
}, {
  timestamps: true 
});

module.exports = mongoose.model("AdminDetails", adminDetails);
