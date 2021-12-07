const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const search = require("./public/js/search");
const utils = require("./public/js/utils");
const gradientSelection = require("./public/js/gradientSelection");

const app = express();

dotenv.config({ path: ".env" });
const port = process.env.PORT || 8080;
const weatherAPI = process.env.WEATHER_API;

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
  try {
    const response = await search.searchData("toronto", weatherAPI);
    const selectedGradient = gradientSelection.makeSelection(response);
    res.render("index", { response, utils, selectedGradient });
  } catch (error) {
    console.log("error");
  }
});

app.get("/search", async function (req, res) {
  try {
    const response = await search.searchData(req.query.city, weatherAPI);
    const selectedGradient = gradientSelection.makeSelection(response);
    res.render("index", { response, utils, selectedGradient });
  } catch (error) {
    console.log("error");
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
