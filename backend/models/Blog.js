// models/Blog.js
const mongoose = require("mongoose");
const Counter = require("./Counter");

const BlogSchema = new mongoose.Schema(
  {
    blogId: { type: String, unique: true }, // “BLOG000” vb.
    title: { type: String, required: true },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 3,
        message: "En az 1, en fazla 3 görsel olabilir.",
      },
    },
    content: { type: String, required: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Yeni bir blog kaydedildiğinde blogId üret
BlogSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Counter dokümanını 1 arttır (veya oluştur)
    const counter = await Counter.findOneAndUpdate(
      { _id: "blog" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // BLOG000 formatı (0 padded)
    const seqNum = counter.seq - 1;
    this.blogId = `BLOG${String(seqNum).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
