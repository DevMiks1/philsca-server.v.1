/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personnelDetails = new Schema({
    isIdIssued: { type: Boolean, default: false, required: false },
    position: {type: String, required: false},
    hgt: {type: String, required: false},
    wgt: {type: String, required: false},
    sss: {type: String, required: false},
    tin: {type: String, required: false},
});

module.exports = mongoose.model("PersonnelDetails", personnelDetails);
