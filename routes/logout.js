/** @format */

const express = require("express");
const router = express.Router();
const authentication = require('../middleware/authentication');
const { logout } = require("../controllers/logout");

router.post("/logout", authentication, logout);

module.exports = router;
