const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "./config.env" });

const mongoDB = require("./db");

const PORT = 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

// Middleware
app.use(express.json());
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));

app.listen(PORT, () => {
  console.log(`Example App running on PORT ${PORT}`);
});
