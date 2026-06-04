require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const getArg = (name) => {
  const prefix = `--${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
};

const toPositiveInteger = (value, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const cleanupUnverifiedUsers = async () => {
  const confirm = process.argv.includes("--confirm");
  const days = toPositiveInteger(
    getArg("days") || process.env.UNVERIFIED_CUTOFF_DAYS,
    7
  );
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  await connectDB();

  const filter = {
    role: { $ne: "admin" },
    createdAt: { $lte: cutoff },
    $or: [
      { isVerified: false },
      { isEmailVerified: false },
      { emailVerified: false },
      { phoneVerified: false },
      { verified: false }
    ]
  };

  const users = await User.find(filter).select("name email phoneNumber createdAt");

  console.log(`Unverified user cleanup cutoff: ${cutoff.toISOString()}`);
  console.log(`Matched users: ${users.length}`);

  users.forEach((user) => {
    console.log(`${user._id} | ${user.email} | ${user.phoneNumber} | ${user.createdAt.toISOString()}`);
  });

  if (!confirm) {
    console.log("Dry run only. Re-run with --confirm to delete matched users.");
    return;
  }

  const result = await User.deleteMany(filter);
  console.log(`Deleted users: ${result.deletedCount}`);
};

cleanupUnverifiedUsers()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
