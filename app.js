const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const app = express();

dotenv.config({ path: ".env" });
const port = process.env.PORT || 8080;

//log request
app.use(morgan("tiny"));

//parse request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set view engine
app.set("view engine", "ejs");

//load assets
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (req, res) {
  res.render("index");
});

app.get("/:id", async function (req, res) {
  console.log(req.params);
  res.render("index", req.params);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
