// routes/product.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const multer = require("multer");

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post("/", upload.array("img", 5), async (req, res) => {
  try {
    // multipart/form-data içinden gelen text alanlar string olarak
    const {
      name,
      description,
      category,
      colors,
      sizes,
      price, // e.g. { current: 100, discount: 10 }
    } = req.body;

    // gelen dosyaları base64’e çevir
    const img = req.files.map((file) => file.buffer.toString("base64"));

    const newProduct = new Product({
      name,
      description,
      category, // ObjectId string
      colors: JSON.parse(colors), // client: JSON.stringify(colorsArray)
      sizes: JSON.parse(sizes), // client: JSON.stringify(sizesArray)
      price: JSON.parse(price), // client: JSON.stringify({ current, discount })
      img,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// READ SINGLE
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// UPDATE
router.put("/:productId", upload.array("img", 5), async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.colors) updates.colors = JSON.parse(req.body.colors);
    if (req.body.sizes) updates.sizes = JSON.parse(req.body.sizes);
    if (req.body.price) updates.price = JSON.parse(req.body.price);

    // Eğer yeni resimler yüklenmişse onları base64 olarak güncelle
    if (req.files && req.files.length > 0) {
      updates.img = req.files.map((file) => file.buffer.toString("base64"));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      updates,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE
router.delete("/:productId", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.productId);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// SEARCH BY NAME
router.get("/search/:productName", async (req, res) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.productName, $options: "i" },
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
