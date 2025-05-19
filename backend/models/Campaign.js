// models/Campaign.js
const mongoose = require("mongoose");

const CampaignSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    background: { type: String, required: true }, // base64 image string
    description: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", CampaignSchema);
