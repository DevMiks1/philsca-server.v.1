/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAccount = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roleDetailsId: { type: Schema.Types.ObjectId, ref: 'RoleDetails', required: true },
  date: { type: Date, default: Date.now }, // Custom date field
}, {
  timestamps: true 
});

module.exports = mongoose.model("UserAccount", userAccount);
