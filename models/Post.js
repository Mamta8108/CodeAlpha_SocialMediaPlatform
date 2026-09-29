const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, default: '' },   // Stores file path or URL
  mediaType: { type: String, default: '' },  // 'image' or 'video'
  likes: { type: Number, default: 0 },
  comments: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);