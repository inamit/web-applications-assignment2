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
    console.error("Error saving comment:", err);
    res.status(500).json({ error: "An error occurred while saving the comment." });
  }
};

const updateCommentById = async (req, res) => {
  const { comment_id } = req.params;
  const { content, sender } = req.body;

  try {
    if (!content || !sender)
      return res.status(400).json({ error: "Content and sender are required." });
    const updatedComment = await Comment.findByIdAndUpdate(comment_id, { content, sender }, { new: true, runValidators: true });
    if (!updatedComment)
      return res.status(404).json({ error: "Comment not found." });
    res.json(updatedComment);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "An error occurred while updating the comment." });
  }
};

module.exports = { getAllComments, getCommentsByPostId, saveNewComment, updateCommentById };
