const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phoneNumber: {
  type: String,
  required: true,
  unique: true,
  trim: true
},

  password: {
    type: String,
    required: true
  },

  role: {
  type: String,
  enum: ["admin", "user"],
  default: "user"
  },

  emailOTP: {
  type: String
},

emailOTPExpire: {
  type: Date
},

isEmailVerified: {
  type: Boolean,
  default: false
},
  addresses: [
  {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
    }
  ],

  resetPasswordToken: String,

  resetPasswordExpire: Date

}, { timestamps: true });

module.exports =
mongoose.model("User", userSchema);