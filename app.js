const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/user");
const Post = require("./models/post");

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vuyrz5j.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if there's an error connecting to MongoDB
  });

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("comments")
      .populate("reactions.likes")
      .populate("reactions.dislikes");
    res.json(posts);
  } catch (error) {
    console.error("Error retrieving posts: ", error);
    next(error); // Pass the error to the next middleware
  }
});

// Route to create a new post
app.post("/posts", async (req, res, next) => {
  try {
    const { title, content, username } = req.body;
    const post = new Post({ title, content, username });
    await post.save();

    // Associate the post with the user
    const user = await User.findOne({ username });
    user.posts.push(post);
    await user.save();

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    next(error); // Pass the error to the next middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "An internal server error occurred" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
