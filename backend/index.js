const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "./config.env" });

const mongoDB = require("./db");

const PORT = 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoDB();

app.get("/", (req, res) => {
  console.log("Hello");
  res.send("HEllo");
});

app.listen(PORT, () => {
  console.log(`Example App running on PORT ${PORT}`);
});
