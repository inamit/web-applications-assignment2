const express = require("express");
const router = express.Router();

const {
  getAllComments,
  updateCommentById,
  deleteCommentById,
} = require("../controllers/comment");
router.get("/", getAllComments);
router.put("/:comment_id", updateCommentById);
router.delete("/:comment_id", deleteCommentById);

module.exports = router;
