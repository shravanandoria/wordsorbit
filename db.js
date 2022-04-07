const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
const connecToMongo = () =>
  mongoose
    .connect(url)
    .then(() => {
      console.log("Db is Connected");
    })
    .catch((err) => {
      console.log({ Error: err });
    });

module.exports = connecToMongo;

