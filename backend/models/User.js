// models/User.js
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
