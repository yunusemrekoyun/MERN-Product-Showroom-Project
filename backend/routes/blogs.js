const express = require("express");
const multer = require("multer");
const Blog = require("../models/Blog");
const Comment = require("../models/BlogComment");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// CREATE blog (max 3 görsel)
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { title, content } = req.body;

    const images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const blog = new Blog({ title, content, images });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all blogs (images hariç)
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).select("-images");
  res.json(blogs);
});

// GET single blog by blogId (images hariç, ama count dahil)
router.get("/:blogId", async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.blogId });
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı." });

    const blogObj = blog.toObject();
    blogObj.imagesCount = blog.images.length;
    if (!req.query.withImages) {
      delete blogObj.images;
    }
    res.json(blogObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET specific image by index
router.get("/:blogId/image/:index", async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.blogId }).select(
      "images"
    );
    const index = Number(req.params.index);
    if (!blog || !blog.images[index]) return res.status(404).end();

    res.set("Content-Type", blog.images[index].contentType);
    res.send(blog.images[index].data);
  } catch (err) {
    res.status(500).json({ error: "Görsel gösterilemedi." });
  }
});

//  PUT /api/blogs/:blogId route
router.put("/:blogId", upload.array("images", 3), async (req, res) => {
  try {
    const blog = await Blog.findOne({ blogId: req.params.blogId });
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı." });

    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;

    // 🔍 Silinecek eski görsellerin indexlerini al
    const toDeleteIndexes = req.body.toDeleteIndexes
      ? JSON.parse(req.body.toDeleteIndexes)
      : [];

    // Sırayla sil
    toDeleteIndexes
      .sort((a, b) => b - a)
      .forEach((i) => blog.images.splice(i, 1));

    // Yeni görseller varsa ekle
    if (req.files?.length) {
      blog.images.push(
        ...req.files.map((f) => ({ data: f.buffer, contentType: f.mimetype }))
      );
    }

    // Toplam en fazla 3 görsel
    blog.images = blog.images.slice(0, 3);

    await blog.save();

    const obj = blog.toObject();
    obj.imagesCount = blog.images.length;
    delete obj.images;

    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE blog
router.delete("/:blogId", async (req, res) => {
  await Blog.findOneAndDelete({ blogId: req.params.blogId });
  res.json({ message: "Silindi" });
});

// COMMENTS – listele
router.get("/:blogId/comments", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  const comments = await Comment.find({ blog: blog._id }).populate(
    "user",
    "username"
  );
  res.json(comments);
});

// COMMENTS – ekle
router.post("/:blogId/comments", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  const comment = new Comment({
    blog: blog._id,
    user: req.body.userId,
    content: req.body.content,
  });
  await comment.save();
  res.status(201).json(comment);
});

// LIKES – toggle
router.post("/:blogId/like", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  const userId = req.body.userId;

  const idx = blog.likedBy.indexOf(userId);
  if (idx >= 0) blog.likedBy.splice(idx, 1);
  else blog.likedBy.push(userId);

  await blog.save();
  res.json({ likesCount: blog.likedBy.length });
});
// GET /api/blogs/likes/total-count
router.get("/likes/total-count", async (req, res) => {
  try {
    const result = await Blog.aggregate([
      { $project: { likedCount: { $size: "$likedBy" } } },
      { $group: { _id: null, total: { $sum: "$likedCount" } } },
    ]);
    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    console.error("Blog beğeni toplam hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});
module.exports = router;
