const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 1
  },
  postedAt: {
    type: String,
    required: true
  },
  postNumber: {
    type: Number,
    required: true
  }
});

var Post = mongoose.model('posts',postSchema);

module.exports = {Post};
