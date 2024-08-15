/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDetails = new Schema({
  personalInfoId: { type: Schema.Types.ObjectId, ref: "PersonalInfo" },
  userAccountId: { type: Schema.Types.ObjectId, ref: "UserAccount" },
});

module.exports = mongoose.model("UserDetails", userDetails);
