/** @format */
const UserAccountModel = require("../models/userAccount");
const RoleDetailsModel = require("../models/role/roleDetails");
const UserDetailsModel = require("../models/userDetails");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email and role
    const user = await UserAccountModel.findOne({ email });
    const existingRole = await RoleDetailsModel.findOne({ role });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    if (!existingRole) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare passwords (plain text comparison)
    if (password !== user.password) {
      return res.status(401).send("Email or Password is incorrect");
    }

    // Fetch user personal details using user ID from userAccount
    const userDetails = await UserDetailsModel.findOne({
      userAccountId: user._id,
    })
      .populate({
        path: "userAccountId",
        populate: {
          path: "roleDetailsId",
        },
      })
      .populate("personalInfoId");

    // Generate JWT token
    const token = jwt.sign({ user: userDetails }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript
      secure: true, // Cookie is only sent over HTTPS
      sameSite: "Strict", // Helps prevent CSRF attacks
    });

    res.status(200).json({
      token: token,
      message: "Successfully Login",
    });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};
