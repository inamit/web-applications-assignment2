require("dotenv").config();
const { connectDB } = require("./db");
connectDB();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", require("./routes/post"));
app.use("/posts/:postID/comments", require("./routes/comment"));
app.use("/comments", require("./routes/allComments"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
