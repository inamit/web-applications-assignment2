const express = require("express");
const router = express.Router();

const { getPosts, saveNewPost, getPostById } = require("../controllers/post");
router.get("/", getPosts);
router.post("/", saveNewPost);
router.get("/:post_id", getPostById)

module.exports = router;