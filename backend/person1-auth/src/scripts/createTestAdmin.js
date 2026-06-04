require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const requiredEnv = ["ADMIN_EMAIL", "ADMIN_PHONE", "ADMIN_PASSWORD"];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env values: ${missing.join(", ")}`);
  }

  if (!/^[0-9]{10}$/.test(process.env.ADMIN_PHONE)) {
    throw new Error("ADMIN_PHONE must be a 10 digit phone number");
  }
};

const createTestAdmin = async () => {
  validateEnv();
  await connectDB();

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const phoneNumber = process.env.ADMIN_PHONE.trim();
  const name = process.env.ADMIN_NAME || "Test Admin";
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }]
  });

  if (existingUser) {
    existingUser.name = name;
    existingUser.email = email;
    existingUser.phoneNumber = phoneNumber;
    existingUser.password = password;
    existingUser.role = "admin";
    existingUser.isVerified = true;
    existingUser.isEmailVerified = true;
    existingUser.emailVerified = true;
    existingUser.phoneVerified = true;
    existingUser.verified = true;
    await existingUser.save();

    console.log("Test admin account updated successfully");
    console.log(`Email: ${existingUser.email}`);
    console.log(`Phone: ${existingUser.phoneNumber}`);
    return;
  }

  const admin = await User.create({
    name,
    email,
    phoneNumber,
    password,
    role: "admin",
    isVerified: true,
    isEmailVerified: true,
    emailVerified: true,
    phoneVerified: true,
    verified: true
  });

  console.log("Test admin account created successfully");
  console.log(`Email: ${admin.email}`);
  console.log(`Phone: ${admin.phoneNumber}`);
};

createTestAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
