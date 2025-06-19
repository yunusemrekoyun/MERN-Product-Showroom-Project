const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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

    const verificationToken = Math.random().toString(36).substring(2, 15); // basit token

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      emailVerified: false,
    });

    await newUser.save();

    // E-posta gönder
    const transporter = require("nodemailer").createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Site Adı" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "E-posta Doğrulama",
      html: `
        <h2>Merhaba ${username},</h2>
        <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
        <a href="${process.env.CLIENT_DOMAIN}/verify-email/${verificationToken}">
          E-postamı Doğrula
        </a>
        <p>Bu işlem sizin tarafınızdan yapılmadıysa bu e-postayı görmezden gelebilirsiniz.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Kayıt başarılı. E-posta gönderildi." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// E-posta doğrulama
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res
        .status(400)
        .send("Geçersiz veya süresi dolmuş doğrulama bağlantısı.");
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_DOMAIN}/email-confirmed`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Doğrulama işlemi sırasında hata oluştu.");
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
      emailVerified: user.emailVerified, // ✅ buraya eklendi
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
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "E-posta bulunamadı." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000; // 15 dakika

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_DOMAIN}/reset-password/${token}`;

    await transporter.sendMail({
      from: `\"Site Adı\" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Şifre Sıfırlama Talebi",
      html: `
        <h3>Merhaba ${user.username},</h3>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın. Bağlantı 15 dakika geçerlidir.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Bu isteği siz yapmadıysanız görmezden gelebilirsiniz.</p>
      `,
    });

    res.status(200).json({ message: "Şifre sıfırlama bağlantısı gönderildi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

// ✅ Şifreyi sıfırlayan endpoint
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token geçersiz veya süresi dolmuş." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Şifreniz başarıyla güncellendi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});
module.exports = router;
