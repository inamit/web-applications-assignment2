const express = require("express");
const router = express.Router();

const { getAllComments, updateCommentById } = require("../controllers/comment");
router.get("/", getAllComments);
router.put("/:comment_id", updateCommentById);

module.exports = router;