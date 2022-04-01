require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const connecToMongo = require("./db");
const cors = require("cors");
connecToMongo();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/articles", require("./routes/articles"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running");
  });
}

app.listen(80, () => {
  console.log(`The Server running on port ${process.env.PORT}`);
});
