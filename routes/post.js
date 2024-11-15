const express = require("express");
const router = express.Router();

const { getAllPosts, saveNewPost } = require("../controllers/post");
router.get("/", getAllPosts);
router.post("/", saveNewPost);

module.exports = router;