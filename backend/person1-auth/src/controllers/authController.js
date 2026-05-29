const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const generateToken =
require("../utils/generateToken");

exports.register = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Check existing user
    const existingUser =
      await User.findOne({ email });

    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
});

  } catch(error){

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
        }
    }
    });

  } catch(error){

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
    .select("-password");

    res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: {
    user
    }
    });

  } catch(error){

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateProfile = async (req, res) => {

  try {

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(

      req.user.id,

      {
        name,
        email
      },

      {
        new: true
      }

    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user
      }
    });

  } catch(error){

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    // Generate random token
    const resetToken =
      crypto.randomBytes(20).toString("hex");

    // Save token in DB
    user.resetPasswordToken = resetToken;

    // Token expiry time (10 mins)
    user.resetPasswordExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken: resetToken
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.resetPassword = async (req, res) => {

  try {

    // Get token from URL
    const { token } = req.params;

    // Get new password from body
    const { password } = req.body;

    // Find user with matching token
    const user = await User.findOne({

      resetPasswordToken: token,

      resetPasswordExpire: {
        $gt: Date.now()
      }

    });

    // Check token validity
    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });

    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    // Remove reset fields
    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};