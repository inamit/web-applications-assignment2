const express = require("express");
const router = express.Router();

const { getAllComments, saveNewComment } = require("../controllers/comment");
router.get("/", getAllComments);
router.post("/", saveNewComment);

module.exports = router;