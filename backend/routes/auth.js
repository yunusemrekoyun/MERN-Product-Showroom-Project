const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

// Kullanıcı Oluşturma (Register)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email address is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      // avatar alanı boş bırakılıyor, ayrı endpoint ile alınacak
    });

    await newUser.save();

    const { password: _, ...rest } = newUser.toObject(); // Şifreyi döndürme
    res.status(201).json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// Kullanıcı Girişi (Login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar?.data
        ? `data:${user.avatar.contentType};base64,${user.avatar.data.toString(
            "base64"
          )}`
        : null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
