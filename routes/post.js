const express = require("express");
const router = express.Router();

const { getAllPosts, saveNewPost, getPostById } = require("../controllers/post");
router.get("/", getAllPosts);
router.post("/", saveNewPost);
router.get("/:post_id", getPostById)

module.exports = router;