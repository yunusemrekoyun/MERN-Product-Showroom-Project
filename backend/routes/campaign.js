// routes/campaign.js
const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });
// READ SINGLE
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "products"
    );
    if (!campaign) {
      return res.status(404).json({ error: "Kampanya bulunamadı" });
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CREATE
router.post("/", upload.single("background"), async (req, res) => {
  try {
    const { title, description, products } = req.body;
    const background = req.file.buffer.toString("base64");

    const campaign = new Campaign({
      title,
      description,
      background,
      products: JSON.parse(products),
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("products");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", upload.single("background"), async (req, res) => {
  try {
    const { title, description, products } = req.body;
    const updateData = {
      title,
      description,
      products: JSON.parse(products),
    };
    if (req.file) {
      updateData.background = req.file.buffer.toString("base64");
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Kampanya silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
