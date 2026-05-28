const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({

  roleName: {

    type: String,

    required: true,

    unique: true,

    enum: ["admin", "user"]

  }

}, {

  timestamps: true

});

module.exports =
mongoose.model("Role", roleSchema);