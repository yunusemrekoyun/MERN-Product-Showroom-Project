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

module.exports = router;
