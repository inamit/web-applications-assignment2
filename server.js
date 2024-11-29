require('dotenv').config();
const { connectDB } = require("./db");
connectDB();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", require("./routes/posts_route"));
app.use("/comments", require("./routes/comments_route"));

module.exports = app;