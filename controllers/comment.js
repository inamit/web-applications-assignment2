const Comment = require("../models/Comment");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const saveNewComment = async (req, res) => {
  try {
    const comment = new Comment({
      postID: req.body.postID,
      content: req.body.content,
      sender: req.body.sender,
    });
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllComments, saveNewComment };