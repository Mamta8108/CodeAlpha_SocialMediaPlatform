const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post with optional photo/video upload
router.post('/', upload.single('mediaFile'), async (req, res) => {
  try {
    const { author, content } = req.body;
    let mediaUrl = '';
    let mediaType = '';

    if (req.file) {
      mediaUrl = `http://localhost:5001/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
        mediaType = 'video';
      } else {
        mediaType = 'image';
      }
    }

    const newPost = new Post({ author, content, mediaUrl, mediaType });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to like post' });
  }
});

// Add comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

// Delete a Post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Delete a Comment
router.delete('/:postId/comment/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();
    res.json({ message: 'Comment deleted successfully', post });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;