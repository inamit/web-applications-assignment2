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

const getPostById = async (req, res) => {
  const { post_id } = req.params;
  try {
    const post = await Post.findById(post_id);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(400).json({ error: "Invalid post ID" });
  }
};

module.exports = { getAllPosts, saveNewPost, getPostById };
