const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveNewPost = async (req, res) => {
  try {
    const post = new Post({
      message: req.body.message,
      sender: req.body.sender,
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllPosts, saveNewPost };
