const express = require("express");
const router = express.Router({ mergeParams: true });

const { saveNewComment, getCommentsByPostId } = require("../controllers/comment");

router.post("/", saveNewComment);
router.get("/", getCommentsByPostId);

module.exports = router;
