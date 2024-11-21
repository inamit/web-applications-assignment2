const Comment = require("../models/Comment");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCommentsByPostId = async (req, res) => {
  const { post_id } = req.params;

  try {
    const comments = await Comment.find({ postID: post_id });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveNewComment = async (req, res) => {
  const { post_id } = req.params;

  try {
    const comment = new Comment({
      postID: post_id,
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllComments, getCommentsByPostId, saveNewComment };
