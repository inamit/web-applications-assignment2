const Post = require("../models/post");

const getPosts = async (req, res) => {
  const { sender } = req.query;
  try {
    let posts = [];
    if (sender)
      posts = await Post.find({ sender: sender });
    else
      posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveNewPost = async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
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

const updatePostById = async (req, res) => {
  const { post_id } = req.params;
  const { content, sender } = req.body;
  try {
      if (!content || !sender)
          return res.status(400).json({ error: "Content and sender are required." });
      const updatedPost = await Post.findByIdAndUpdate(post_id, { content, sender }, { new: true, runValidators: true });
      if (!updatedPost)
          return res.status(404).json({ error: "Post not found." });
      res.json(updatedPost);
  } catch (err) {
      console.error("Error updating post:", err);
      res.status(500).json({ error: "An error occurred while updating the post." });
  }
};

module.exports = { getPosts, saveNewPost, getPostById, updatePostById };
