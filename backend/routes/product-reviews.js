// 📁 routes/productReviews.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Add a new review to a product
router.post("/:productId", async (req, res) => {
  try {
    const { text, rating, user } = req.body;
    if (!text || !rating || !user)
      return res.status(400).json({ error: "Eksik alanlar var." });

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Ürün bulunamadı." });

    product.reviews.push({ text, rating, user });
    await product.save();

    const populated = await Product.findById(product._id).populate(
      "category reviews.user",
      "username avatar"
    );
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// ✅ Get reviews and review count of a product
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .select("reviews")
      .populate("reviews.user", "username avatar");

    if (!product) return res.status(404).json({ error: "Ürün bulunamadı." });

    res.json({
      reviews: product.reviews,
      total: product.reviews.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

module.exports = router;
