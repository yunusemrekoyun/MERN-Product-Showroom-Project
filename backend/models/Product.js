const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const ImageSchema = mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    // 3 resim alanı, her biri dizi
    mainImages: [ImageSchema],
    childImages1: [ImageSchema],
    childImages2: [ImageSchema],

    reviews: [ReviewSchema],

    opt1: [{ type: String }],
    opt2: [{ type: String }],

    price: {
      current: { type: Number },
      discount: { type: Number },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: String,
    },

    mainDescription: { type: String },
    childDescription1: { type: String },
    childDescription2: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
