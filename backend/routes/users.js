// routes/users.js
const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();

// Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ GET total user count (önce bu gelmeli)
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ total: count });
  } catch (err) {
    console.error("Kullanıcı sayısı hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// ✅ GET total favorite product count
router.get("/favorites/total-count", async (req, res) => {
  try {
    const count = await User.aggregate([
      { $unwind: "$favorites" },
      { $group: { _id: "$favorites" } },
      { $count: "total" },
    ]);
    res.json({ total: count[0]?.total || 0 });
  } catch (err) {
    console.error("Favori sayısı alınamadı:", err.message, err.stack);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ GET single user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-avatar.data")
      .populate("favorites", "name")
      .lean();

    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ GET user avatar image
router.get("/:userId/image", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("avatar");
    if (!user || !user.avatar?.data) return res.status(404).end();

    res.set("Content-Type", user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (err) {
    res.status(500).json({ error: "Avatar yüklenemedi." });
  }
});

// ✅ UPDATE user (with optional avatar + password)
router.put("/:userId", upload.single("avatar"), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (req.file) {
      updates.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updated = await User.findByIdAndUpdate(req.params.userId, updates, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, ...rest } = updated.toObject();
    res.json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ DELETE user
router.delete("/:userId", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.userId);
    if (!deleted) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ TOGGLE favorite product
router.post("/:userId/favorites/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      user.favorites.push(productId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error("❌ Favori işlemi hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
