const express = require("express");
const router = express.Router();

const { saveNewComment } = require("../controllers/comment");

router.post("/", saveNewComment);

module.exports = router;