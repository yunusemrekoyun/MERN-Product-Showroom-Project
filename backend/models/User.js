// 1) User modeline "emailVerified" alanı ekleniyor
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    avatar: {
      data: Buffer,
      contentType: String,
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    emailVerified: { type: Boolean, default: false }, // ✅ yeni alan
    verificationToken: { type: String }, // ✅ onay için token
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
