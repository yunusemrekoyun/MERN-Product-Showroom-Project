// routes/blogs.js
const express = require("express");
const multer = require("multer");
const Blog = require("../models/Blog");
const Comment = require("../models/BlogComment");
const router = express.Router();

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// CREATE blog
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files.map((f) => f.buffer.toString("base64"));
    const blog = new Blog({ title, content, images });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// READ single blog by blogId
router.get("/:blogId", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  if (!blog) return res.status(404).json({ error: "Blog bulunamadı." });
  res.json(blog);
});

// UPDATE blog
router.put("/:blogId", upload.none(), async (req, res) => {
  try {
    const { title, content } = req.body;


    const images = JSON.parse(req.body.images); // dikkat!

    const update = {
      title,
      content,
      images,
    };

    const blog = await Blog.findOneAndUpdate(
      { blogId: req.params.blogId },
      update,
      { new: true }
    );

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE blog
router.delete("/:blogId", async (req, res) => {
  await Blog.findOneAndDelete({ blogId: req.params.blogId });
  res.json({ message: "Silindi" });
});

// COMMENTS: listele
router.get("/:blogId/comments", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  const comments = await Comment.find({ blog: blog._id }).populate(
    "user",
    "username"
  );
  res.json(comments);
});

// COMMENTS: ekle
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

// LIKES: kullanıcı beğenisi ekle/çıkar
router.post("/:blogId/like", async (req, res) => {
  const blog = await Blog.findOne({ blogId: req.params.blogId });
  const userId = req.body.userId;
  const idx = blog.likedBy.indexOf(userId);
  if (idx >= 0) blog.likedBy.splice(idx, 1);
  else blog.likedBy.push(userId);
  await blog.save();
  res.json({ likesCount: blog.likedBy.length });
});

module.exports = router;
