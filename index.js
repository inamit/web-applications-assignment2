const { connectDB } = require("./db");
connectDB();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", require("./routes/post"));
app.use("/posts/:post_id/comments", require("./routes/commentsByPostId"));
app.use("/comments", require("./routes/commentsById"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
