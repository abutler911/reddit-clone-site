const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
