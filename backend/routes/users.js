// routes/users.js
const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const router = express.Router();

// 1) Multer memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 2) READ all users (unchanged)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// 3) READ single user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// 4) UPDATE user (including avatar upload)
router.put(
  "/:userId",
  upload.single("avatar"), // expect form‐field named "avatar"
  async (req, res) => {
    try {
      const updates = { ...req.body };

      // If a file was uploaded, convert to base64 and store
      if (req.file) {
        updates.avatar = req.file.buffer.toString("base64");
      }

      const updated = await User.findByIdAndUpdate(req.params.userId, updates, {
        new: true,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// 5) DELETE user
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

module.exports = router;
